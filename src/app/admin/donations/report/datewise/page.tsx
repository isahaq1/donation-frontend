"use client";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchDateRangeReport } from "@/redux/slices/donationSlice";
import { AppDispatch, RootState } from "@/redux/store";

const DatewiseReport = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { dateRangeReport, loading, error } = useSelector(
    (state: RootState) => state.donation,
  );
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const handleSearch = () => {
    if (startDate && endDate) {
      dispatch(fetchDateRangeReport({ startDate, endDate }));
    }
  };

  return (
    <div className="p-6">
      <h1 className="mb-6 text-2xl font-bold">Datewise Donation Report</h1>

      {/* Date Filter Section */}
      <div className="mb-6">
        <div className="flex items-end gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Start Date
            </label>
            <input
              className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              End Date
            </label>
            <input
              className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>
          <button
            className="w-1/4 rounded-md bg-blue-500 px-5 py-3 text-white hover:bg-blue-600"
            onClick={handleSearch}
            disabled={!startDate || !endDate || loading}
          >
            {loading ? "Loading..." : "Search"}
          </button>
        </div>
      </div>

      {/* Error Message */}
      {error && <div className="mb-4 text-red-500">{error}</div>}

      {/* Report Summary */}
      {dateRangeReport && (
        <div className="space-y-6">
          <div>
            <h2 className="mb-4 text-xl font-semibold">Summary</h2>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <div className="rounded-lg bg-green-50 p-4">
                <p className="text-sm text-gray-600">Total Amount</p>
                <p className="text-2xl font-bold">
                  ${dateRangeReport.totalAmount}
                </p>
                <p className="text-sm text-gray-600">
                  Count: {dateRangeReport.totalCount}
                </p>
              </div>
              <div className="rounded-lg bg-blue-50 p-4">
                <p className="text-sm text-gray-600">Active Amount</p>
                <p className="text-2xl font-bold">
                  ${dateRangeReport.activeAmount}
                </p>
                <p className="text-sm text-gray-600">
                  Count: {dateRangeReport.activeCount}
                </p>
              </div>
              <div className="rounded-lg bg-red-50 p-4">
                <p className="text-sm text-gray-600">Deleted Amount</p>
                <p className="text-2xl font-bold">
                  ${dateRangeReport.deletedAmount}
                </p>
                <p className="text-sm text-gray-600">
                  Count: {dateRangeReport.deletedCount}
                </p>
              </div>
            </div>
          </div>

          {/* Daily Reports Table */}
          <div>
            <h2 className="mb-4 text-xl font-semibold">Daily Reports</h2>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[800px]">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="p-3 text-left">Date</th>
                    <th className="p-3 text-right">Total Amount</th>
                    <th className="p-3 text-right">Total Count</th>
                    <th className="p-3 text-right">Active Amount</th>
                    <th className="p-3 text-right">Active Count</th>
                    <th className="p-3 text-right">Deleted Amount</th>
                    <th className="p-3 text-right">Deleted Count</th>
                  </tr>
                </thead>
                <tbody>
                  {dateRangeReport.dailyReports.map((daily) => (
                    <tr key={daily.date} className="border-b">
                      <td className="p-3">
                        {new Date(daily.date).toLocaleDateString()}
                      </td>
                      <td className="p-3 text-right">${daily.totalAmount}</td>
                      <td className="p-3 text-right">{daily.totalCount}</td>
                      <td className="p-3 text-right">${daily.activeAmount}</td>
                      <td className="p-3 text-right">{daily.activeCount}</td>
                      <td className="p-3 text-right">${daily.deletedAmount}</td>
                      <td className="p-3 text-right">{daily.deletedCount}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DatewiseReport;
