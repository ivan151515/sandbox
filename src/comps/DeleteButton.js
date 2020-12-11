import IconButton from "@material-ui/core/IconButton"
import {auth} from "../firebase/config"
import {useState} from "react"
import DeleteIcon from '@material-ui/icons/Delete';
import DeletePostDialog from "./DeletePostDialog"
import Tooltip from '@material-ui/core/Tooltip';

const DeleteButton = ({userId, postId}) => {
    const [open, setOpen] = useState(false)
    const markup = auth.currentUser.uid === userId ? (
    <Tooltip title="Delete">
        <IconButton aria-label="delete" onClick={() => setOpen(!open)} className="delete-post">
            <DeleteIcon />
            <DeletePostDialog open={open} setOpen={setOpen} postId={postId}/>
        </IconButton>
    </Tooltip>)
     :
      null

      return <>{markup}</>
}

export default DeleteButton