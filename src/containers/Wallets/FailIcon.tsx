import React, { Fragment } from 'react';

export const FailIcon = () => {
    return (
        <Fragment>
            Failed
            <div className="ml-2 inlineBlock">
                <svg width="15" height="15" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M1.00015 1L8.99993 9.00002" stroke="#991A24" strokeWidth="2" strokeLinecap="round"/>
                    <path d="M8.99988 1L1.0001 9.00002" stroke="#991A24" strokeWidth="2" strokeLinecap="round"/>
                </svg>
            </div>
        </Fragment>
    );
};
