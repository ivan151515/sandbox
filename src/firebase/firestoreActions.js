import {firestore, auth, increment} from "./config"
import NoImg from "../images/no-img.png"

export const updateUserDetails =async (bio, website) => {
    firestore.collection("users").doc(auth.currentUser.uid).update({bio, website})
    .then(() => console.log("Details updated successfully"))
    .catch(function(error) {
        console.log("Error getting documents: ", error);
    });
}
export const getUserCredentials = async () => {
    if (!auth.currentUser) {

        return
    }
    let credentials;
    await firestore.collection("users").doc(auth.currentUser.uid)
    .get()
    .then(function(doc) {
        if (doc.exists) {
            credentials = {...doc.data()}
        } else {
            // doc.data() will be undefined in this case
            console.log("No such document!");
        }
        // credentials = docs[0]
    })
    .catch(function(error) {
        console.log("Error getting documents: ", error);
    });
    console.log(credentials)
    return credentials
}
export const createUserData = async( username) => {
    const userObj = {
        username,
        userId: auth.currentUser.uid,
        email: auth.currentUser.email
    }
    await firestore.collection("users").doc(auth.currentUser.uid).set(userObj)
}

export const createPost = (body, credentials) => {
    let imageUrl = credentials.imageUrl || NoImg
    let postObject = {
        username: credentials.username,
        body,
        imageUrl,
        createdAt: new Date().toISOString(),
        userId: auth.currentUser.uid,
        comments: 0,
        likes: 0,
    }
    firestore.collection("posts").add(postObject)
    .then(() => console.log("Post created successfully"))
    .catch(err=>console.error(err.message))
        
}
export const createComment = (body, credentials, postData) => {
    let imageUrl = credentials.imageUrl || NoImg;
    let commentObject = {
        username: credentials.username,
        body,
        imageUrl,
        createdAt: new Date().toISOString(),
        userId: auth.currentUser.uid,
        postId: postData.postId
    }
    firestore.collection("comments").add(commentObject)
    .then(() => {
       return firestore.collection("posts").doc(postData.postId).update("comments", increment(1))
    })
    .then(() => {
        console.log("Comment created successfully");
    })
    .catch(err => console.log(err.message))
}
export const likePost = (postId, username) => {
    const likeObject = {
        postId,
        username,
        userId: auth.currentUser.uid
    }
   return firestore.collection("likes").add(likeObject)
   .then(() => {
       return firestore.collection("posts").doc(postId).update("likes", increment(1))
   })
   .then(() => console.log("post liked"))
   .catch(err => console.log(err.message))
}
export const unLikePost = (postId) => {
    firestore.collection("likes").where("postId", "==", postId).where("userId", "==", auth.currentUser.uid).get()
    .then(snap => {
        snap.forEach(doc => doc.ref.delete())
    })
    .then(() => {
       return firestore.collection("posts").doc(postId).update("likes", increment(-1))
    })
    .then(() => console.log("postUnlikedSuccessfuly"))
    .catch(err => console.log(err.message))
}
export const deletePost = (postData) => {
    const commentsOnPost = postData.comments > 0 ? firestore.collection("comments").where("postId", "==", postData.postId) : false
    firestore.collection("posts").doc(postData.postId)
    .delete()
    .then(() => {
        if (commentsOnPost) {
            return commentsOnPost.get()
        }
        else {
            return {}
        }
    })
    .then((data) => {
        if (data.empty) {
            console.log("No comments to delete")
            return
        }
        else {
           data.forEach(doc => {
               doc.ref.delete()
           })
           return 
        }
    })
    .then(() => console.log("Post and its comments deleted"))
    .catch(err => console.error(err.message)) 
}
export const deleteComment = (commentId, postId) => {
    firestore.collection("comments").doc(commentId)
    .delete()
    .then(() => {
       return firestore.collection("posts").doc(postId).update("comments", increment(-1) )
    })
    .then(() => console.log("comment deleted successfully"))
    .catch(err => console.error(err.message))
}
