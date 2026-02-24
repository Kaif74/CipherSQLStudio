import React from 'react';
import './ResultsPanel.scss';
import { Terminal, AlertCircle, CheckCircle } from 'lucide-react';

const ResultsPanel = ({ results, isExecuting }) => {
    return (
        <div className="results-panel">
            <div className="results-header">
                <Terminal size={16} className="icon" />
                <h3>Query Results</h3>
            </div>

            <div className="results-content">
                {isExecuting ? (
                    <div className="results-loading">
                        <div className="spinner"></div>
                        <p>Executing query...</p>
                    </div>
                ) : !results ? (
                    <div className="results-empty">
                        <p>Run a query to see results here.</p>
                    </div>
                ) : results.error ? (
                    <div className="results-error">
                        <AlertCircle size={20} className="error-icon" />
                        <div className="error-message">
                            <h4>Execution Error</h4>
                            <p>{results.error}</p>
                        </div>
                    </div>
                ) : (
                    <div className="results-success">
                        <div className="success-banner">
                            <CheckCircle size={16} className="success-icon" />
                            <span>Query executed successfully. Return {results.rows?.length || 0} rows.</span>
                        </div>

                        <div className="table-responsive">
                            <table>
                                <thead>
                                    <tr>
                                        {results.columns?.map((col, idx) => (
                                            <th key={idx}>{col}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {results.rows?.map((row, rowIdx) => (
                                        <tr key={rowIdx}>
                                            {row.map((cell, cellIdx) => (
                                                <td key={cellIdx}>{cell}</td>
                                            ))}
                                        </tr>
                                    ))}
                                    {(!results.rows || results.rows.length === 0) && (
                                        <tr>
                                            <td colSpan={results.columns?.length || 1} className="no-rows">
                                                0 rows returned.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ResultsPanel;
