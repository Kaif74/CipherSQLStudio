import React, { useState, useEffect } from 'react';
import './HintPanel.scss';
import { Lightbulb, X, Sparkles } from 'lucide-react';

const HintPanel = ({ onClose, hintText, isGenerating }) => {
    // The component is now simpler. It just displays what the parent gives it.
    // In a more advanced implementation, we could have the HintPanel itself
    // handle the interaction, maybe asking follow-up questions to the LLM.

    return (
        <div className="hint-overlay" onClick={onClose}>
            <div className="hint-panel" onClick={e => e.stopPropagation()}>
                <div className="hint-header">
                    <div className="hint-title">
                        <Sparkles size={18} className="icon-sparkle" />
                        <h3>AI Assistant Hint</h3>
                    </div>
                    <button className="btn-close" onClick={onClose}>
                        <X size={20} />
                    </button>
                </div>

                <div className="hint-body">
                    {isGenerating ? (
                        <div className="hint-loading">
                            <div className="typing-indicator">
                                <span></span><span></span><span></span>
                            </div>
                            <p>Tutor is thinking...</p>
                        </div>
                    ) : (
                        <div className="hint-content animate-fade-in">
                            <Lightbulb size={24} className="icon-bulb" />
                            <p>{hintText}</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default HintPanel;
