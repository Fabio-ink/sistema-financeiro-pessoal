import React from 'react';
import PageTitle from './ui/PageTitle';

function MonthlyPlanningContent() {
    console.log("MonthlyPlanningContent - Minimal component rendered");
    return (
        <div className="container mx-auto">
            <PageTitle level={3}>Monthly Planning Content - Test</PageTitle>
            <p>This is a minimal test component for Monthly Planning Content.</p>
        </div>
    );
}

export default MonthlyPlanningContent;