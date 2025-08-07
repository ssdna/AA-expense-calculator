import React from 'react';
import { calculatePersonSummary } from '../utils/calculator';

const Summary = ({ persons, expenses }) => {
  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);

  return (
    <div className="card">
      <h2 className="text-lg font-bold mb-3 text-gray-800">费用汇总</h2>
      
      <div className="mb-4 p-3 bg-blue-50 rounded-lg">
        <div className="text-center">
          <div className="text-2xl font-bold text-blue-600">¥{totalExpenses.toFixed(2)}</div>
          <div className="text-xs text-gray-600">总费用</div>
        </div>
      </div>

      <div className="space-y-2">
        <h3 className="text-sm md:text-base font-semibold text-gray-800 mb-2">个人费用明细</h3>
        {persons.map(person => {
          const summary = calculatePersonSummary(person, expenses);
          return (
            <div key={person.id} className="p-2 md:p-3 bg-gray-50 rounded-lg">
              <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-1.5 gap-1">
                <span className="font-medium text-gray-800 text-sm">{person.name}</span>
                <span className={`font-semibold text-base md:text-lg ${
                  summary.balance > 0 ? 'settlement-positive' : 
                  summary.balance < 0 ? 'settlement-negative' : 'text-gray-600'
                }`}>
                  {summary.balance > 0 ? '+' : ''}¥{summary.balance.toFixed(2)}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
                <div className="text-center md:text-left">
                  <span className="block mb-0.5">已支付</span>
                  <span className="font-medium text-sm">¥{summary.totalPaid.toFixed(2)}</span>
                </div>
                <div className="text-center md:text-left">
                  <span className="block mb-0.5">应分摊</span>
                  <span className="font-medium text-sm">¥{summary.totalShould.toFixed(2)}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {persons.length === 0 && (
        <div className="text-center py-6 text-gray-500 text-sm">
          暂无人员数据
        </div>
      )}
    </div>
  );
};

export default Summary;
