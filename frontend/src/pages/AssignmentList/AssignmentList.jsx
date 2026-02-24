import React, { useState, useEffect, useContext } from 'react';
import { Search, CheckCircle2, Circle, Lock, Loader2, PlayCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getAssignments } from '../../services/assignmentService';
import { AuthContext } from '../../context/AuthContext';
import './AssignmentList.scss';

const AssignmentList = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [assignments, setAssignments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { user } = useContext(AuthContext);

    useEffect(() => {
        const fetchAssignments = async () => {
            try {
                const data = await getAssignments();
                const storageKey = user ? `attemptedAssignments_${user._id}` : null;
                const attemptedMap = storageKey
                    ? JSON.parse(localStorage.getItem(storageKey) || '{}')
                    : {};
                const enrichedData = data.map((item, index) => {
                    const attemptInfo = attemptedMap[item._id];
                    let status = 'unsolved';
                    if (attemptInfo) {
                        status = attemptInfo.isCorrect ? 'solved' : 'attempted';
                    }
                    return {
                        ...item,
                        acceptance: `${(Math.random() * (90 - 30) + 30).toFixed(1)}%`,
                        status
                    };
                });
                setAssignments(enrichedData);
                setLoading(false);
            } catch (err) {
                console.error("Failed to fetch assignments", err);
                setError(err.message || 'Failed to load problems');
                setLoading(false);
            }
        };

        fetchAssignments();
    }, []);

    const filteredAssignments = assignments.filter((assignment) =>
        assignment.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const getStatusIcon = (status) => {
        switch (status) {
            case 'solved':
                return <CheckCircle2 size={16} className="status-icon solved" />;
            case 'attempted':
                return <PlayCircle size={16} className="status-icon attempted" />;
            default:
                return <Circle size={16} className="status-icon unsolved" />;
        }
    };

    const getDifficultyClass = (diff) => {
        switch (diff.toLowerCase()) {
            case 'easy': return 'diff-easy';
            case 'medium': return 'diff-medium';
            case 'hard': return 'diff-hard';
            default: return '';
        }
    };

    return (
        <div className="assignment-list">
            <div className="list-toolbar">
                <div className="toolbar-tabs">
                    <button className="tab active">All Problems</button>
                    {/* <button className="tab">Database</button>
                    <button className="tab">Algorithms</button> */}
                </div>

                <div className="toolbar-search">
                    <Search className="search-icon" size={16} />
                    <input
                        type="text"
                        placeholder="Search questions"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            <div className="table-container">
                <table className="problem-table">
                    <thead>
                        <tr>
                            <th className="col-status">Status</th>
                            <th className="col-title">Title</th>
                            <th className="col-acceptance">Acceptance</th>
                            <th className="col-difficulty">Difficulty</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr>
                                <td colSpan="4" className="empty-state">
                                    <div className="empty-state__content">
                                        <Loader2 className="animate-spin" size={24} />
                                        <span>Loading problems...</span>
                                    </div>
                                </td>
                            </tr>
                        ) : error ? (
                            <tr>
                                <td colSpan="4" className="empty-state" style={{ color: '#ef4444' }}>
                                    {error}
                                </td>
                            </tr>
                        ) : filteredAssignments.length > 0 ? (
                            filteredAssignments.map((assignment, index) => (
                                <tr key={assignment._id} className={index % 2 === 0 ? 'row-even' : 'row-odd'}>
                                    <td className="col-status">
                                        {getStatusIcon(assignment.status)}
                                    </td>
                                    <td className="col-title">
                                        {assignment.status === 'locked' ? (
                                            <span className="locked-text">{assignment.title}</span>
                                        ) : (
                                            <Link to={`/assignments/${assignment._id}`} className="problem-link">
                                                {assignment.title}
                                            </Link>
                                        )}
                                    </td>
                                    <td className="col-acceptance">{assignment.acceptance}</td>
                                    <td className={`col-difficulty ${getDifficultyClass(assignment.difficulty)}`}>
                                        {assignment.difficulty}
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="4" className="empty-state">
                                    No problems found matching "{searchTerm}"
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AssignmentList;
