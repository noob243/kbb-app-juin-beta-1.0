
import React, { FC } from 'react';
import { DownloadIcon } from './Icons';

interface PageContainerProps {
  title: string;
  children: React.ReactNode;
  buttonLabel?: string;
  onButtonClick?: () => void;
  exportButtonLabel?: string;
  onExportClick?: () => void;
  extraHeaderActions?: React.ReactNode;
}

const PageContainer: FC<PageContainerProps> = ({ title, children, buttonLabel, onButtonClick, exportButtonLabel, onExportClick, extraHeaderActions }) => (
    <div>
        <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-800">{title}</h1>
            <div className="flex items-center space-x-4">
                {extraHeaderActions}
                {exportButtonLabel && onExportClick && (
                    <button onClick={onExportClick} className="bg-gray-700 text-white font-bold py-2 px-4 rounded-lg hover:bg-gray-800 transition duration-300 shadow-sm flex items-center">
                        <DownloadIcon />
                        <span className="ml-2">{exportButtonLabel}</span>
                    </button>
                )}
                {buttonLabel && onButtonClick && (
                    <button onClick={onButtonClick} className="bg-indigo-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-indigo-700 transition duration-300 shadow-sm flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                        {buttonLabel}
                    </button>
                )}
            </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
            {children}
        </div>
    </div>
);

export default PageContainer;
