import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ChevronLeft, Play, Lightbulb, Loader2 } from 'lucide-react';
import QuestionPanel from '../../components/assignment/QuestionPanel';
import SampleDataViewer from '../../components/assignment/SampleDataViewer';
import SqlEditor from '../../components/assignment/SqlEditor';
import ResultsPanel from '../../components/assignment/ResultsPanel';
import HintPanel from '../../components/assignment/HintPanel';
import { getAssignmentById } from '../../services/assignmentService';
import { executeQuery } from '../../services/queryService';
import { generateHint } from '../../services/hintService';
import { AuthContext } from '../../context/AuthContext';
import './AssignmentAttempt.scss';

const AssignmentAttempt = () => {
    const { id } = useParams();
    const { user } = useContext(AuthContext);
    const [assignment, setAssignment] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [query, setQuery] = useState('');
    const [results, setResults] = useState(null);
    const [isExecuting, setIsExecuting] = useState(false);

    const [showHint, setShowHint] = useState(false);
    const [hintText, setHintText] = useState('');
    const [isGeneratingHint, setIsGeneratingHint] = useState(false);

    useEffect(() => {
        const fetchAssignment = async () => {
            try {
                const data = await getAssignmentById(id);
                setAssignment(data);
                setLoading(false);
            } catch (err) {
                console.error("Failed to fetch assignment", err);
                setError(err.message || 'Error loading assignment');
                setLoading(false);
            }
        };
        fetchAssignment();
    }, [id]);

    const handleRunQuery = async () => {
        setIsExecuting(true);
        setResults(null);
        try {
            const data = await executeQuery(id, query);
            if (data.success) {
                let columns = [];
                let rows = [];

                if (data.data && data.data.length > 0) {
                    columns = Object.keys(data.data[0]);
                    rows = data.data.map(rowObj => columns.map(col => rowObj[col]));
                }

                setResults({
                    success: true,
                    columns,
                    rows,
                    rowCount: data.rowCount,
                    executionTimeMs: data.executionTimeMs,
                    isCorrect: data.isCorrect,
                    message: data.message
                });

                // Mark this assignment as attempted in localStorage (scoped to user)
                if (user) {
                    const storageKey = `attemptedAssignments_${user._id}`;
                    const attempted = JSON.parse(localStorage.getItem(storageKey) || '{}');
                    attempted[id] = { attempted: true, isCorrect: data.isCorrect };
                    localStorage.setItem(storageKey, JSON.stringify(attempted));
                }
            } else {
                setResults({ error: data.message });
            }
        } catch (err) {
            console.error('Execution Error:', err);

            let errorMessage = 'Execution failed';

            if (err.response && err.response.data) {
                if (err.response.data.message) {
                    errorMessage = err.response.data.message;
                } else if (typeof err.response.data === 'string') {
                    errorMessage = err.response.data;
                } else {
                    errorMessage = JSON.stringify(err.response.data);
                }
            } else {
                errorMessage = err.message;
            }

            setResults({ error: errorMessage });
        } finally {
            setIsExecuting(false);
        }
    };

    const handleGetHint = async () => {
        setShowHint(true);
        if (hintText) return;

        setIsGeneratingHint(true);
        try {
            const data = await generateHint(id, query);
            setHintText(data.hint || data.message || 'Could not generate hint.');
        } catch (err) {
            setHintText(err.response?.data?.message || 'Error communicating with AI tutor.');
        } finally {
            setIsGeneratingHint(false);
        }
    };

    if (loading) {
        return <div className="loading-state"><Loader2 className="animate-spin" size={32} /> Loading Assignment...</div>;
    }

    if (error || !assignment) {
        return <div className="error-state">Error: {error || 'Assignment not found'}</div>;
    }

    return (
        <div className="assignment-attempt">
            <header className="attempt-header">
                <div className="attempt-header__left">
                    <Link to="/" className="back-link">
                        <ChevronLeft size={20} />
                        <span>Back</span>
                    </Link>
                    <h1 className="attempt-header__title">{assignment.title}</h1>
                </div>
                <div className="attempt-header__actions">
                    <button
                        className="btn-hint"
                        onClick={handleGetHint}
                    >
                        <Lightbulb size={16} />
                        Get Hint
                    </button>
                    <button
                        className="btn-run"
                        onClick={handleRunQuery}
                        disabled={isExecuting}
                    >
                        <Play size={16} />
                        {isExecuting ? 'Running...' : 'Run Query'}
                    </button>
                </div>
            </header>

            <div className="attempt-layout">
                {/* Left Column: Context & Data */}
                <div className="layout-col layout-col--sidebar">
                    <QuestionPanel
                        description={assignment.description}
                    />
                    <SampleDataViewer
                        schemaDetails={assignment.schemaDetails || []}
                    />
                </div>

                {/* Right Column: Editor & Results */}
                <div className="layout-col layout-col--main">
                    <div className="editor-container">
                        <SqlEditor value={query} onChange={setQuery} />
                    </div>
                    <div className="results-container">
                        <ResultsPanel results={results} isExecuting={isExecuting} />
                    </div>
                </div>
            </div>

            {showHint && (
                <HintPanel
                    onClose={() => setShowHint(false)}
                    hintText={hintText}
                    isGenerating={isGeneratingHint}
                />
            )}
        </div>
    );
};

export default AssignmentAttempt;
