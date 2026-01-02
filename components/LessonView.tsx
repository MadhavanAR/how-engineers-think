'use client';

import { useState } from 'react';
import { Lesson, CodeExecutionResponse } from '@/types';
import SingleIDE from './SingleIDE';

interface LessonViewProps {
  lesson: Lesson;
  onBack: () => void;
}

export default function LessonView({ lesson, onBack }: LessonViewProps) {
  return (
    <>
      <button className="fixed-back-button" onClick={onBack} title="Back to Lessons">
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12.5 15L7.5 10L12.5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>
      <div className="lesson-view">
        <div className="lesson-header">
        <h2>{lesson.title}</h2>
        <p className="subtitle">{lesson.subtitle}</p>
      </div>

      <div className="concept-section">
        <h3>{lesson.concept.title}</h3>
        <p>{lesson.concept.content}</p>
      </div>

      <div className="concept-section">
        <h3>{lesson.scenario.title}</h3>
        <p>{lesson.scenario.content}</p>
      </div>

      <div className="concept-section">
        <h3>Where this shows up in real systems</h3>
        <ul>
          {lesson.applications.map((app, index) => (
            <li key={index}>{app}</li>
          ))}
        </ul>
      </div>

        <div className="code-examples">
          <SingleIDE lesson={lesson} />
        </div>
      </div>
    </>
  );
}
