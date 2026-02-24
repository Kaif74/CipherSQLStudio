import React from 'react';
import './QuestionPanel.scss';
import { HelpCircle } from 'lucide-react';

const QuestionPanel = ({ description }) => {
    return (
        <div className="question-panel">
            <div className="question-panel__header">
                <HelpCircle size={18} className="icon" />
                <h2>Question Requirements</h2>
            </div>
            <div className="question-panel__content">
                <p>{description}</p>
            </div>
        </div>
    );
};

export default QuestionPanel;
