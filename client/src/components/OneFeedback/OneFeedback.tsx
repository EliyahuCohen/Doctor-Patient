import React from 'react'
import { IRating } from '../../types/type'
import "./feedback.scss"
import { AiOutlineStar } from "react-icons/ai";
import { format } from 'date-fns';
import {motion} from "framer-motion"

const OneFeedback = ({ feedback,index }: {index:number, feedback: IRating }) => {
    return (
        <motion.div initial={{x:-200,opacity:0}} animate={{x:0,opacity:1}} transition={{delay:0.2*index}} className="oneFeedback">
            <p className="feedbackName">{feedback.userName}</p>
            <div>
                <p className="feedbackContent">{feedback.feedback}</p>
                <div className="feedbackFooter">
                    <span className="ratingNumber">{feedback.rating}<AiOutlineStar fill={"gold"} /></span>
                    <span>
                        {format(new Date(feedback.createdAt), "dd/MM/yyyy")}
                    </span>
                </div>
            </div>
        </motion.div>
    )
}

export default OneFeedback
