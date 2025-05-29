import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';

const ReportDetailPage = () => {
  const { reportId } = useParams(); // Get reportId from URL
  const [report, setReport] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchReportDetails = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(`http://localhost:8080/api/reports/${reportId}`);
        setReport(response.data);
        setError(null);
      } catch (err) {
        console.error(`Error fetching report details for ID ${reportId}:`, err);
        setError(err.message || `Failed to fetch report (ID: ${reportId}).`);
        setReport(null);
      }
      setIsLoading(false);
    };

    if (reportId) {
      fetchReportDetails();
    }
  }, [reportId]); // Re-run effect if reportId changes

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center"><p className="text-gray-700 text-xl">Loading report details...</p></div>;
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-red-500">
        <p className="text-xl mb-4">Error: {error}</p>
        <Link to="/reports" className="text-blue-500 hover:underline">Go back to reports list</Link>
      </div>
    );
  }

  if (!report) {
    return <div className="min-h-screen flex items-center justify-center"><p className="text-gray-700 text-xl">Report not found.</p></div>;
  }

  // Helper function to format date and time
  const formatDateTime = (dateTimeString) => {
    if (!dateTimeString) return 'N/A';
    return new Date(dateTimeString).toLocaleString();
  };

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white shadow-xl rounded-lg overflow-hidden">
        <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
          <h1 className="text-2xl font-bold text-gray-800">Report Details</h1>
        </div>
        <div className="px-6 py-8">
          <div className="space-y-6">
            <div>
              <h2 className="text-sm font-medium text-gray-500">Report ID</h2>
              <p className="mt-1 text-lg text-gray-900">{report.id}</p>
            </div>
            <hr />
            <div>
              <h2 className="text-sm font-medium text-gray-500">Location</h2>
              <p className="mt-1 text-lg text-gray-900">{report.location}</p>
            </div>
            <hr />
            <div>
              <h2 className="text-sm font-medium text-gray-500">Issue Type</h2>
              <p className="mt-1 text-lg text-gray-900 capitalize">{report.issueType ? report.issueType.replace('_', ' ') : 'N/A'}</p>
            </div>
            <hr />
            <div>
              <h2 className="text-sm font-medium text-gray-500">Description</h2>
              <p className="mt-1 text-lg text-gray-900 whitespace-pre-wrap">{report.description}</p>
            </div>
            <hr />
            <div>
              <h2 className="text-sm font-medium text-gray-500">Date Reported</h2>
              <p className="mt-1 text-lg text-gray-900">{formatDateTime(report.dateReported)}</p>
            </div>
            <hr />
            <div>
              <h2 className="text-sm font-medium text-gray-500">Status</h2>
              <p className="mt-1 text-lg">
                <span className={`px-3 py-1 inline-flex text-sm leading-5 font-semibold rounded-full ${
                  report.status === 'Pending Review' ? 'bg-yellow-100 text-yellow-800' :
                  report.status === 'Investigation Underway' ? 'bg-blue-100 text-blue-800' :
                  report.status === 'Resolved' ? 'bg-green-100 text-green-800' :
                  report.status === 'Actioned' ? 'bg-indigo-100 text-indigo-800' :
                  'bg-gray-100 text-gray-800' 
                }`}>
                  {report.status || 'N/A'}
                </span>
              </p>
            </div>
            {report.imageUrl && (
              <>
                <hr />
                <div>
                  <h2 className="text-sm font-medium text-gray-500">Image</h2>
                  {/* Construct the full URL for the image */}
                  <img 
                    src={`http://localhost:8080/api/reports/images/${report.imageUrl}`}
                    alt={`Report ${report.id}`}
                    className="mt-2 rounded-lg shadow-md max-w-full h-auto" 
                    style={{maxHeight: '400px'}}
                    onError={(e) => { e.target.style.display = 'none'; /* Hide img tag if image fails to load */ }}
                  />
                  {/* <p className="mt-1 text-lg text-gray-900">Image URL: <a href={report.imageUrl} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">{report.imageUrl}</a></p> */}
                </div>
              </>
            )}
            {(report.reportedBy || report.contactEmail) && <hr />}
            {report.reportedBy && (
              <div>
                <h2 className="text-sm font-medium text-gray-500">Reported By</h2>
                <p className="mt-1 text-lg text-gray-900">{report.reportedBy}</p>
              </div>
            )}
            {report.contactEmail && (
              <div>
                <h2 className="text-sm font-medium text-gray-500">Contact Email</h2>
                <p className="mt-1 text-lg text-gray-900">{report.contactEmail}</p>
              </div>
            )}
          </div>
        </div>
        <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
          <Link 
            to="/reports" 
            className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          >
            &larr; Back to Reports List
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ReportDetailPage; 