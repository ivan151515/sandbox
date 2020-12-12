import {useState, useEffect} from "react"
import {firestore, auth} from "../firebase/config"

const useNotifications = () => {
    const [notifications, setNotifications] = useState([])

    useEffect(() => {
        const unsub = firestore.collection("notifications").where("recipient", "==", auth.currentUser.uid)
        .onSnapshot(snap => {
            let docs = []
            snap.forEach(doc => {
                docs.push({notificationId: doc.id, ...doc.data()})
            })
            setNotifications(docs)
        })

        return () => unsub()
    }, [])

    return {notifications}
}

export default useNotifications