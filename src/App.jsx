import React, { useState } from 'react';
import { Calculator, Info, AlertCircle, IndianRupee, Clock, Users, Train, Shield } from 'lucide-react';

export default function IRCTCRefundCalculator() {
  const [formData, setFormData] = useState({
    departureDate: '',
    departureTime: '',
    cancellationDate: '',
    cancellationTime: '',
    passengers: 1,
    totalFare: '',
    travelClass: '',
    ticketStatus: '',
    nonRefundableFees: 0,
    isTatkal: false
  });

  const [result, setResult] = useState(null);

  const classOptions = [
    { value: 'AC1_EXE', label: 'AC First Class / Executive Class' },
    { value: 'AC2_FC', label: 'AC 2 Tier / First Class' },
    { value: 'AC3_CC_EC', label: 'AC 3 Tier / AC Chair Car / AC 3 Economy' },
    { value: 'SL', label: 'Sleeper Class (SL)' },
    { value: '2S', label: 'Second Class (2S)' }
  ];

  const statusOptions = [
    { value: 'CNF', label: 'Confirmed (CNF)' },
    { value: 'RAC', label: 'RAC' },
    { value: 'WL', label: 'Waitlisted (WL)' }
  ];

  const getMinCharge = (travelClass) => {
    const charges = {
      'AC1_EXE': 240,
      'AC2_FC': 200,
      'AC3_CC_EC': 180,
      'SL': 120,
      '2S': 60
    };
    return charges[travelClass] || 0;
  };

  const calculateRefund = () => {
    const { departureDate, departureTime, cancellationDate, cancellationTime, 
            passengers, totalFare, travelClass, ticketStatus, nonRefundableFees, isTatkal } = formData;

    if (!departureDate || !departureTime || !cancellationDate || !cancellationTime || 
        !totalFare || !travelClass || !ticketStatus) {
      alert('Please fill all mandatory fields');
      return;
    }

    const sdt = new Date(`${departureDate}T${departureTime}`);
    const ct = new Date(`${cancellationDate}T${cancellationTime}`);
    const timeDiffMs = sdt - ct;
    const timeDiffHours = timeDiffMs / (1000 * 60 * 60);
    const timeDiffMinutes = timeDiffMs / (1000 * 60);

    const fare = parseFloat(totalFare);
    const nonRefundable = parseFloat(nonRefundableFees) || 0;
    const numPassengers = parseInt(passengers);
    const ppFare = fare / numPassengers;

    let totalDeduction = 0;
    let cancellationChargePerPassenger = 0;
    let breakdown = {};
    let message = '';

    if (isTatkal && ticketStatus === 'CNF') {
      setResult({
        totalFare: fare,
        totalCancellationCharges: fare,
        breakdown: { message: 'Confirmed Tatkal tickets are non-refundable' },
        nonRefundableFees: nonRefundable,
        netRefund: 0,
        message: 'Confirmed Tatkal tickets are non-refundable as per IRCTC rules.'
      });
      return;
    }

    if (ticketStatus === 'RAC' || ticketStatus === 'WL') {
      const clerkage = 60 * numPassengers;
      
      if (ticketStatus === 'WL') {
        message = 'Note: If ticket remains WL after chart preparation, full refund is automatic. This calculation is for manual cancellation.';
      }

      if (timeDiffMinutes > 30) {
        totalDeduction = clerkage + nonRefundable;
        breakdown = {
          clerkage: clerkage,
          note: 'Cancelled more than 30 minutes before departure'
        };
      } else {
        totalDeduction = fare;
        breakdown = {
          message: 'No refund - Cancelled within 30 minutes of departure'
        };
      }

      const netRefund = Math.max(0, fare - totalDeduction);

      setResult({
        totalFare: fare,
        totalCancellationCharges: totalDeduction - nonRefundable,
        breakdown,
        nonRefundableFees: nonRefundable,
        netRefund,
        message,
        timeDiff: timeDiffMinutes
      });
      return;
    }

    const minCharge = getMinCharge(travelClass);

    if (timeDiffHours > 48) {
      cancellationChargePerPassenger = minCharge;
      breakdown.category = 'More than 48 hours before departure';
      breakdown.chargeType = 'Flat minimum charge';
    } else if (timeDiffHours > 12) {
      cancellationChargePerPassenger = Math.max(ppFare * 0.25, minCharge);
      breakdown.category = '12-48 hours before departure';
      breakdown.chargeType = '25% of fare or minimum charge (whichever is higher)';
    } else if (timeDiffHours > 4) {
      cancellationChargePerPassenger = Math.max(ppFare * 0.50, minCharge);
      breakdown.category = '4-12 hours before departure';
      breakdown.chargeType = '50% of fare or minimum charge (whichever is higher)';
    } else {
      cancellationChargePerPassenger = ppFare;
      breakdown.category = 'Within 4 hours of departure';
      breakdown.chargeType = '100% deduction (No refund)';
    }

    totalDeduction = (cancellationChargePerPassenger * numPassengers) + nonRefundable;
    const netRefund = Math.max(0, fare - totalDeduction);

    breakdown.minCharge = minCharge;
    breakdown.perPassengerCharge = cancellationChargePerPassenger.toFixed(2);

    setResult({
      totalFare: fare,
      totalCancellationCharges: cancellationChargePerPassenger * numPassengers,
      breakdown,
      nonRefundableFees: nonRefundable,
      netRefund,
      message: '',
      timeDiff: timeDiffHours
    });
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const resetForm = () => {
    setFormData({
      departureDate: '',
      departureTime: '',
      cancellationDate: '',
      cancellationTime: '',
      passengers: 1,
      totalFare: '',
      travelClass: '',
      ticketStatus: '',
      nonRefundableFees: 0,
      isTatkal: false
    });
    setResult(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-700 text-white py-6 shadow-lg">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex items-center gap-3 mb-2">
            <Train className="w-10 h-10" />
            <div>
              <h1 className="text-3xl font-bold">Rail Refund Calculator</h1>
              <p className="text-indigo-100 text-sm">Estimate your e-ticket cancellation refund</p>
            </div>
          </div>
        </div>
      </div>

      {/* Important Disclaimer Banner */}
      <div className="bg-red-50 border-t-4 border-red-500">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-start gap-3">
            <Shield className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-red-900 mb-1">
                Important Notice: Not Affiliated with IRCTC
              </p>
              <p className="text-xs text-red-800">
                This calculator is an independent tool and is NOT associated with, endorsed by, or affiliated with Indian Railway Catering and Tourism Corporation (IRCTC) or Indian Railways in any way. 
                It calculates refund estimates based on publicly available IRCTC refund rules and should be used for informational purposes only.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Info Card */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-6 mb-8 shadow-sm">
          <div className="flex items-start gap-3">
            <Info className="w-6 h-6 text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-blue-900 mb-2">How to Use This Calculator</h3>
              <p className="text-sm text-blue-800 leading-relaxed">
                Enter your ticket details including departure time, cancellation time, fare amount, and travel class. 
                The calculator will estimate your refund based on official IRCTC cancellation rules. 
                All fields marked with * are mandatory for accurate calculation.
              </p>
            </div>
          </div>
        </div>

        {/* Main Form */}
        <div className="bg-white rounded-xl shadow-xl overflow-hidden mb-8">
          <div className="bg-gradient-to-r from-indigo-500 to-indigo-600 px-6 py-4">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Calculator className="w-6 h-6" />
              Enter Ticket Details
            </h2>
          </div>

          <div className="p-6">
            {/* Departure Information */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <Train className="w-5 h-5 text-indigo-600" />
                Scheduled Departure Information
              </h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Departure Date <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    name="departureDate"
                    value={formData.departureDate}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Departure Time <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="time"
                    name="departureTime"
                    value={formData.departureTime}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition"
                  />
                </div>
              </div>
            </div>

            {/* Cancellation Information */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <Clock className="w-5 h-5 text-indigo-600" />
                Cancellation Information
              </h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Cancellation Date <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    name="cancellationDate"
                    value={formData.cancellationDate}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Cancellation Time <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="time"
                    name="cancellationTime"
                    value={formData.cancellationTime}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition"
                  />
                </div>
              </div>
            </div>

            {/* Ticket Details */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <IndianRupee className="w-5 h-5 text-indigo-600" />
                Ticket Details
              </h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Number of Passengers <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    name="passengers"
                    min="1"
                    max="6"
                    value={formData.passengers}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Total Ticket Fare (₹) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    name="totalFare"
                    step="0.01"
                    value={formData.totalFare}
                    onChange={handleInputChange}
                    placeholder="e.g., 1500.00"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Class of Travel <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="travelClass"
                    value={formData.travelClass}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition"
                  >
                    <option value="">-- Select Class --</option>
                    {classOptions.map(opt => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ticket Status <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="ticketStatus"
                    value={formData.ticketStatus}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition"
                  >
                    <option value="">-- Select Status --</option>
                    {statusOptions.map(opt => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Non-Refundable Fees (₹)
                  </label>
                  <input
                    type="number"
                    name="nonRefundableFees"
                    step="0.01"
                    value={formData.nonRefundableFees}
                    onChange={handleInputChange}
                    placeholder="e.g., Service/Convenience charges"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition"
                  />
                </div>
                <div className="flex items-end pb-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      name="isTatkal"
                      checked={formData.isTatkal}
                      onChange={handleInputChange}
                      className="w-5 h-5 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                    />
                    <span className="text-sm font-medium text-gray-700">Tatkal Ticket</span>
                  </label>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4">
              <button
                onClick={calculateRefund}
                className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold py-4 px-6 rounded-lg transition duration-200 flex items-center justify-center gap-2 shadow-lg"
              >
                <Calculator className="w-5 h-5" />
                Calculate Refund Amount
              </button>
              <button
                onClick={resetForm}
                className="px-6 py-4 border-2 border-gray-300 hover:border-gray-400 text-gray-700 font-semibold rounded-lg transition duration-200"
              >
                Reset
              </button>
            </div>
          </div>
        </div>

        {/* Results Section */}
        {result && (
          <div className="bg-white rounded-xl shadow-xl overflow-hidden">
            <div className="bg-gradient-to-r from-green-500 to-green-600 px-6 py-4">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <IndianRupee className="w-6 h-6" />
                Refund Calculation Result
              </h2>
            </div>

            <div className="p-6">
              {result.message && (
                <div className="bg-amber-50 border-l-4 border-amber-500 p-4 mb-6 rounded-r-lg">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-amber-800 leading-relaxed">{result.message}</p>
                  </div>
                </div>
              )}

              <div className="space-y-3">
                <div className="flex justify-between items-center py-4 px-4 bg-gray-50 rounded-lg">
                  <span className="font-semibold text-gray-700">Total Ticket Fare</span>
                  <span className="text-xl font-bold text-gray-900">₹{result.totalFare.toFixed(2)}</span>
                </div>

                <div className="flex justify-between items-center py-4 px-4 bg-red-50 rounded-lg">
                  <span className="font-semibold text-gray-700">Cancellation Charges</span>
                  <span className="text-xl font-bold text-red-600">- ₹{result.totalCancellationCharges.toFixed(2)}</span>
                </div>

                {result.breakdown && (
                  <div className="bg-blue-50 border border-blue-200 p-5 rounded-lg">
                    <h3 className="font-semibold text-blue-900 mb-3 flex items-center gap-2">
                      <Info className="w-4 h-4" />
                      Charge Breakdown
                    </h3>
                    <div className="space-y-2 text-sm text-blue-800">
                      {result.breakdown.category && (
                        <div className="flex items-start gap-2">
                          <span className="text-blue-600">•</span>
                          <span><strong>Time Category:</strong> {result.breakdown.category}</span>
                        </div>
                      )}
                      {result.breakdown.chargeType && (
                        <div className="flex items-start gap-2">
                          <span className="text-blue-600">•</span>
                          <span><strong>Charge Type:</strong> {result.breakdown.chargeType}</span>
                        </div>
                      )}
                      {result.breakdown.perPassengerCharge && (
                        <div className="flex items-start gap-2">
                          <span className="text-blue-600">•</span>
                          <span><strong>Per Passenger:</strong> ₹{result.breakdown.perPassengerCharge}</span>
                        </div>
                      )}
                      {result.breakdown.minCharge && (
                        <div className="flex items-start gap-2">
                          <span className="text-blue-600">•</span>
                          <span><strong>Minimum Charge:</strong> ₹{result.breakdown.minCharge}</span>
                        </div>
                      )}
                      {result.breakdown.clerkage && (
                        <div className="flex items-start gap-2">
                          <span className="text-blue-600">•</span>
                          <span><strong>Clerkage Charge:</strong> ₹{result.breakdown.clerkage}</span>
                        </div>
                      )}
                      {result.breakdown.note && (
                        <div className="flex items-start gap-2">
                          <span className="text-blue-600">•</span>
                          <span>{result.breakdown.note}</span>
                        </div>
                      )}
                      {result.breakdown.message && (
                        <div className="flex items-start gap-2">
                          <span className="text-blue-600">•</span>
                          <span>{result.breakdown.message}</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {result.nonRefundableFees > 0 && (
                  <div className="flex justify-between items-center py-4 px-4 bg-orange-50 rounded-lg">
                    <span className="font-semibold text-gray-700">Non-Refundable Fees</span>
                    <div className="flex items-start gap-2">
                    <span className="text-orange-600">- ₹{result.nonRefundableFees.toFixed(2)}</span>
                  </div>
                  </div>
                )}

                <div className="flex justify-between items-center py-6 px-6 bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-300 rounded-xl mt-4">
                  <div>
                    <span className="text-sm text-green-700 font-medium">Estimated Refund Amount</span>
                    <p className="text-xs text-green-600 mt-1">Amount to be credited to your account</p>
                  </div>
                  <span className="text-3xl font-bold text-green-600">₹{result.netRefund.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Comprehensive Disclaimer */}
        <div className="mt-8 bg-gradient-to-r from-gray-50 to-gray-100 border-2 border-gray-300 rounded-xl p-6 shadow-sm">
          <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-gray-600" />
            Important Disclaimers
          </h3>
          <div className="space-y-3 text-sm text-gray-700 leading-relaxed">
            <p>
              <strong>1. Not Affiliated with IRCTC:</strong> This calculator is an independent tool and is NOT associated with, endorsed by, or affiliated with Indian Railway Catering and Tourism Corporation (IRCTC), Indian Railways, or any government entity. This is a third-party informational tool only.
            </p>
            <p>
              <strong>2. Estimation Only:</strong> The refund amount calculated here is an estimate based on publicly available IRCTC refund rules and regulations. The actual refund amount may vary and is subject to IRCTC's official processing and verification.
            </p>
            <p>
              <strong>3. Rule Changes:</strong> Railway refund rules and policies may change without notice. While we strive to keep the calculator updated with the latest rules, there may be delays in reflecting recent policy changes. Always verify with official IRCTC sources.
            </p>
            <p>
              <strong>4. Special Circumstances:</strong> This calculator does not account for special circumstances, promotional offers, festive season rules, pandemic-related modifications, or any other exceptional conditions that may affect refund calculations.
            </p>
            <p>
              <strong>5. No Liability:</strong> We do not accept any liability for discrepancies between the calculated estimate and the actual refund amount processed by IRCTC. Users should verify all details with IRCTC before making cancellation decisions.
            </p>
            <p>
              <strong>6. Official Verification Required:</strong> For the exact and final refund amount, please refer to the official IRCTC website (www.irctc.co.in) or contact IRCTC customer support directly.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-sm text-gray-600">
          <p>For official information, visit <a href="https://www.irctc.co.in" target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:text-indigo-700 font-semibold underline">www.irctc.co.in</a></p>
          <p className="mt-2">© 2024 Rail Refund Calculator - An Independent Tool</p>
        </div>
      </div>
    </div>
  );
}