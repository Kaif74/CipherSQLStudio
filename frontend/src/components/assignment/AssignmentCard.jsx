import React from 'react';
import { Play, Clock, BarChart } from 'lucide-react';
import { Link } from 'react-router-dom';
import './AssignmentCard.scss';

const AssignmentCard = ({ assignment }) => {
    const { id, title, description, difficulty, estimatedTime, tableCount } = assignment;

    const getDifficultyClass = (diff) => {
        switch (diff.toLowerCase()) {
            case 'easy': return 'difficulty--easy';
            case 'medium': return 'difficulty--medium';
            case 'hard': return 'difficulty--hard';
            default: return '';
        }
    };

    return (
        <div className="assignment-card">
            <div className="assignment-card__header">
                <span className={`assignment-card__difficulty ${getDifficultyClass(difficulty)}`}>
                    {difficulty}
                </span>
                <div className="assignment-card__meta">
                    <span className="meta-item">
                        <Clock size={14} /> {estimatedTime}
                    </span>
                    <span className="meta-item">
                        <BarChart size={14} /> {tableCount} Tables
                    </span>
                </div>
            </div>

            <div className="assignment-card__content">
                <h3 className="assignment-card__title">{title}</h3>
                <p className="assignment-card__description">{description}</p>
            </div>

            <div className="assignment-card__footer">
                <Link to={`/assignments/${id}`} className="assignment-card__btn">
                    <Play size={16} />
                    Start Assignment
                </Link>
            </div>
        </div>
    );
};

export default AssignmentCard;
