import React, { useState } from 'react';

const ExpenseManager = ({ persons, onAdd }) => {
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [payerId, setPayerId] = useState('');
  const [participants, setParticipants] = useState([]);
  const [datetime, setDatetime] = useState(() => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!amount || !description || !payerId || participants.length === 0) {
      alert('请填写完整信息');
      return;
    }

    const expense = {
      amount: parseFloat(amount),
      description: description.trim(),
      payerId: parseInt(payerId),
      participants: participants.map(id => parseInt(id)),
      date: datetime.split('T')[0],
      time: datetime.split('T')[1] || '00:00:00'
    };

    onAdd(expense);
    
    // 重置表单
    setAmount('');
    setDescription('');
    setPayerId('');
    setParticipants([]);
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    setDatetime(`${year}-${month}-${day}T${hours}:${minutes}:${seconds}`);
  };

  const handleParticipantChange = (personId, checked) => {
    if (checked) {
      setParticipants([...participants, personId]);
    } else {
      setParticipants(participants.filter(id => id !== personId));
    }
  };

  const selectAllParticipants = () => {
    setParticipants(persons.map(p => p.id.toString()));
  };

  const clearAllParticipants = () => {
    setParticipants([]);
  };

  return (
    <div className="card">
      <h2 className="text-lg font-bold mb-3 text-gray-800">费用录入</h2>
      
      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            金额（元）
          </label>
          <input
            type="number"
            step="0.01"
            min="0"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="input-field"
            placeholder="请输入金额"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            费用说明
          </label>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="input-field"
            placeholder="如：午餐费用、打车费等"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            支付时间
          </label>
          <input
            type="datetime-local"
            step="1"
            value={datetime}
            onChange={(e) => setDatetime(e.target.value)}
            className="datetime-field"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            支付人
          </label>
          <select
            value={payerId}
            onChange={(e) => setPayerId(e.target.value)}
            className="select-field"
            required
          >
            <option value="">请选择支付人</option>
            {persons.map(person => (
              <option key={person.id} value={person.id}>
                {person.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-medium text-gray-700">
              分摊人员
            </label>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={selectAllParticipants}
                className="text-sm text-blue-600 hover:text-blue-800 touch-target"
              >
                全选
              </button>
              <button
                type="button"
                onClick={clearAllParticipants}
                className="text-sm text-gray-600 hover:text-gray-800 touch-target"
              >
                清空
              </button>
            </div>
          </div>
          <div className="mobile-checkbox-grid md:grid md:grid-cols-2 md:gap-1 md:max-h-28 md:overflow-y-auto custom-scrollbar">
            {persons.map(person => (
              <label key={person.id} className="flex items-center space-x-2 cursor-pointer p-1.5 hover:bg-gray-50 rounded touch-target">
                <input
                  type="checkbox"
                  checked={participants.includes(person.id.toString())}
                  onChange={(e) => handleParticipantChange(person.id.toString(), e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 w-4 h-4"
                />
                <span className="text-sm text-gray-700 flex-1">{person.name}</span>
              </label>
            ))}
          </div>
          {participants.length === 0 && (
            <p className="text-sm text-red-500 mt-1">请至少选择一个分摊人员</p>
          )}
        </div>

        <button
          type="submit"
          className="btn-primary w-full"
          disabled={persons.length === 0}
        >
          添加费用
        </button>
      </form>

      {persons.length === 0 && (
        <div className="text-center py-3 text-gray-500 text-sm">
          请先添加参与人员
        </div>
      )}
    </div>
  );
};

export default ExpenseManager;
