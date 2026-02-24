import React, { useState } from 'react';
import './SampleDataViewer.scss';
import { Database, Table as TableIcon } from 'lucide-react';

const SampleDataViewer = ({ schemaDetails }) => {
    const [activeTab, setActiveTab] = useState('data');
    const [activeTableIndex, setActiveTableIndex] = useState(0);

    if (!schemaDetails || schemaDetails.length === 0) {
        return (
            <div className="sample-data-viewer">
                <div className="empty-state">No schema information available.</div>
            </div>
        );
    }

    const currentTable = schemaDetails[activeTableIndex] || schemaDetails[0];
    const schema = currentTable.columns || [];
    const sampleData = currentTable.sampleData || [];

    return (
        <div className="sample-data-viewer">
            {/* Table selector - if multiple tables */}
            {schemaDetails.length > 1 && (
                <div className="table-selector">
                    {schemaDetails.map((table, index) => (
                        <button
                            key={index}
                            className={`table-selector__btn ${activeTableIndex === index ? 'active' : ''}`}
                            onClick={() => setActiveTableIndex(index)}
                        >
                            <TableIcon size={12} />
                            {table.tableName}
                        </button>
                    ))}
                </div>
            )}

            {/* Table name badge */}
            <div className="table-name-badge">
                <TableIcon size={14} />
                <span>Table: <strong>{currentTable.tableName}</strong></span>
            </div>

            <div className="viewer-header">
                <div className="viewer-tabs">
                    <button
                        className={`tab-btn ${activeTab === 'data' ? 'active' : ''}`}
                        onClick={() => setActiveTab('data')}
                    >
                        <Database size={14} /> Sample Data
                    </button>
                    <button
                        className={`tab-btn ${activeTab === 'schema' ? 'active' : ''}`}
                        onClick={() => setActiveTab('schema')}
                    >
                        <TableIcon size={14} /> Schema
                    </button>
                </div>
            </div>

            <div className="viewer-content">
                {activeTab === 'data' && sampleData && sampleData.length > 0 && (
                    <div className="table-responsive">
                        <table>
                            <thead>
                                <tr>
                                    {Object.keys(sampleData[0]).map((key) => (
                                        <th key={key}>{key}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {sampleData.map((row, index) => (
                                    <tr key={index}>
                                        {Object.values(row).map((val, i) => (
                                            <td key={i}>{val}</td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {activeTab === 'data' && (!sampleData || sampleData.length === 0) && (
                    <div className="empty-state">No sample data available.</div>
                )}

                {activeTab === 'schema' && schema && (
                    <div className="schema-list">
                        {schema.map((col, index) => (
                            <div key={index} className="schema-item">
                                <span className="col-name">{col.name}</span>
                                <span className="col-type">{col.type}</span>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default SampleDataViewer;
