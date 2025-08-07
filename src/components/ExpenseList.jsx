import React, { useState } from 'react';

const ExpenseList = ({ expenses, persons, onUpdate, onDelete }) => {
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});

  const getPersonName = (id) => {
    const person = persons.find(p => p.id === id);
    return person ? person.name : '未知';
  };

  const formatDateTime = (expense) => {
    const date = expense.date || new Date(expense.timestamp).toISOString().split('T')[0];
    const time = expense.time || new Date(expense.timestamp).toTimeString().split(' ')[0];
    return `${new Date(date).toLocaleDateString('zh-CN')} ${time}`;
  };

  const handleEdit = (expense) => {
    setEditingId(expense.id);
    const date = expense.date || new Date(expense.timestamp).toISOString().split('T')[0];
    const time = expense.time || new Date(expense.timestamp).toTimeString().split(' ')[0];
    setEditForm({
      amount: expense.amount,
      description: expense.description,
      payerId: expense.payerId,
      participants: expense.participants,
      datetime: `${date}T${time}`
    });
  };

  const handleSave = () => {
    const updatedExpense = {
      ...editForm,
      date: editForm.datetime.split('T')[0],
      time: editForm.datetime.split('T')[1] || '00:00:00'
    };
    delete updatedExpense.datetime;
    onUpdate(editingId, updatedExpense);
    setEditingId(null);
    setEditForm({});
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditForm({});
  };

  const handleParticipantChange = (personId, checked) => {
    const newParticipants = checked 
      ? [...editForm.participants, personId]
      : editForm.participants.filter(id => id !== personId);
    
    setEditForm({ ...editForm, participants: newParticipants });
  };

  if (expenses.length === 0) {
    return (
      <div className="card">
        <h2 className="text-lg font-bold mb-3 text-gray-800">费用记录</h2>
        <div className="text-center py-6 text-gray-500 text-sm">
          暂无费用记录，请添加费用开始记录
        </div>
      </div>
    );
  }

  return (
    <div className="card">
      <h2 className="text-lg font-bold mb-3 text-gray-800">费用记录</h2>
      
      <div className="table-container custom-scrollbar">
        <table className="w-full">
          <thead>
            <tr>
              <th className="table-header">时间</th>
              <th className="table-header">金额</th>
              <th className="table-header">说明</th>
              <th className="table-header">支付人</th>
              <th className="table-header">分摊人</th>
              <th className="table-header">操作</th>
            </tr>
          </thead>
          <tbody>
            {expenses.map(expense => (
              <tr key={expense.id}>
                {editingId === expense.id ? (
                  <>
                    <td className="table-cell">
                      <input
                        type="datetime-local"
                        step="1"
                        value={editForm.datetime}
                        onChange={(e) => setEditForm({ ...editForm, datetime: e.target.value })}
                        className="datetime-field text-xs"
                      />
                    </td>
                    <td className="table-cell">
                      <input
                        type="number"
                        step="0.01"
                        value={editForm.amount}
                        onChange={(e) => setEditForm({ ...editForm, amount: parseFloat(e.target.value) })}
                        className="input-field text-sm"
                      />
                    </td>
                    <td className="table-cell">
                      <input
                        type="text"
                        value={editForm.description}
                        onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                        className="input-field text-sm"
                      />
                    </td>
                    <td className="table-cell">
                      <select
                        value={editForm.payerId}
                        onChange={(e) => setEditForm({ ...editForm, payerId: parseInt(e.target.value) })}
                        className="select-field text-sm"
                      >
                        {persons.map(person => (
                          <option key={person.id} value={person.id}>
                            {person.name}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="table-cell">
                      <div className="max-h-20 overflow-y-auto">
                        {persons.map(person => (
                          <label key={person.id} className="flex items-center space-x-1 text-xs">
                            <input
                              type="checkbox"
                              checked={editForm.participants.includes(person.id)}
                              onChange={(e) => handleParticipantChange(person.id, e.target.checked)}
                              className="rounded"
                            />
                            <span>{person.name}</span>
                          </label>
                        ))}
                      </div>
                    </td>
                    <td className="table-cell">
                      <div className="flex flex-col md:flex-row gap-0.5">
                        <button onClick={handleSave} className="btn-success touch-target">
                          保存
                        </button>
                        <button onClick={handleCancel} className="btn-secondary touch-target">
                          取消
                        </button>
                      </div>
                    </td>
                  </>
                ) : (
                  <>
                    <td className="table-cell text-xs">{formatDateTime(expense)}</td>
                    <td className="table-cell text-sm font-medium">¥{expense.amount.toFixed(2)}</td>
                    <td className="table-cell text-sm">{expense.description}</td>
                    <td className="table-cell text-sm">{getPersonName(expense.payerId)}</td>
                    <td className="table-cell text-sm">
                      {expense.participants.map(id => getPersonName(id)).join(', ')}
                    </td>
                    <td className="table-cell">
                      <div className="flex flex-col md:flex-row gap-0.5">
                        <button 
                          onClick={() => handleEdit(expense)}
                          className="btn-secondary touch-target"
                        >
                          编辑
                        </button>
                        <button 
                          onClick={() => onDelete(expense.id)}
                          className="btn-danger touch-target"
                        >
                          删除
                        </button>
                      </div>
                    </td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ExpenseList;
