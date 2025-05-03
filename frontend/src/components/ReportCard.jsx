import React, { useEffect, useState } from "react";
import axios from "../axiosConfig";

const ReportCard = () => {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchReport = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await axios.get("/api/v1/user/result");
        if (res.data.status === "success") {
          setReport(res.data.data);
        } else {
          setError("Failed to fetch report card.");
        }
      } catch (err) {
        setError("Error fetching report card.");
      }
      setLoading(false);
    };
    fetchReport();
  }, []);

  if (loading) return <div>Loading report card...</div>;
  if (error) return <div>{error}</div>;
  if (!report) return <div>No report card data found.</div>;

  return (
    <div>
      <h2>Report Card</h2>
      <div>Total Exams: {report.total_exams}</div>
      <div>Passed: {report.passed}</div>
      <div>Failed: {report.failed}</div>
      <div>Grade: {report.grade}</div>
    </div>
  );
};

export default ReportCard;