import React from 'react'
import { IRating } from '../../types/type'
import OneFeedback from '../OneFeedback/OneFeedback'
import "./feedbacks.scss"

const Feedbacks = ({ feedbacks }: { feedbacks: IRating[] }) => {
    return (
        <div className="feedbacksWrapper">
            <h2>Feedbacks ({feedbacks.length || 0}):</h2>
            {feedbacks.map((feedback, index) => {
                return <OneFeedback index={index} key={feedback._id} feedback={feedback} />
            })}
        </div>
    )
}

export default Feedbacks
