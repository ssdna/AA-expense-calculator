import React, { useState } from 'react';
import { generateRandomName } from '../utils/nameGenerator';

const PersonManager = ({ persons, onAdd, onUpdate, onDelete }) => {
  const [newPersonName, setNewPersonName] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editingName, setEditingName] = useState('');

  const handleAdd = () => {
    onAdd(newPersonName.trim() || generateRandomName());
    setNewPersonName('');
  };

  const handleEdit = (person) => {
    setEditingId(person.id);
    setEditingName(person.name);
  };

  const handleSave = () => {
    if (editingName.trim()) {
      onUpdate(editingId, editingName.trim());
    }
    setEditingId(null);
    setEditingName('');
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditingName('');
  };

  return (
    <div className="card">
      <h2 className="text-lg font-bold mb-3 text-gray-800">参与人员管理</h2>
      
      <div className="mb-3">
        <div className="flex flex-col md:flex-row gap-2">
          <input
            type="text"
            placeholder="输入姓名（留空随机生成）"
            value={newPersonName}
            onChange={(e) => setNewPersonName(e.target.value)}
            className="input-field flex-1"
            onKeyPress={(e) => e.key === 'Enter' && handleAdd()}
          />
          <button onClick={handleAdd} className="btn-primary md:whitespace-nowrap">
            添加人员
          </button>
        </div>
      </div>

      <div className="space-y-1.5">
        {persons.map(person => (
          <div key={person.id} className="flex flex-col md:flex-row md:items-center justify-between p-2 bg-gray-50 rounded-lg gap-2">
            {editingId === person.id ? (
              <div className="flex flex-col md:flex-row items-stretch md:items-center gap-2 flex-1">
                <input
                  type="text"
                  value={editingName}
                  onChange={(e) => setEditingName(e.target.value)}
                  className="input-field flex-1"
                  onKeyPress={(e) => e.key === 'Enter' && handleSave()}
                />
                <div className="flex gap-1.5">
                  <button onClick={handleSave} className="btn-success flex-1 md:flex-none">
                    保存
                  </button>
                  <button onClick={handleCancel} className="btn-secondary flex-1 md:flex-none">
                    取消
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div className="flex items-center gap-3 flex-1">
                  <span className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-medium touch-target">
                    {person.id}
                  </span>
                  <span className="font-medium text-gray-800 text-sm md:text-base">{person.name}</span>
                </div>
                <div className="flex gap-1.5 md:flex-shrink-0">
                  <button 
                    onClick={() => handleEdit(person)}
                    className="btn-secondary flex-1 md:flex-none touch-target"
                  >
                    编辑
                  </button>
                  <button 
                    onClick={() => onDelete(person.id)}
                    className="btn-danger flex-1 md:flex-none touch-target"
                  >
                    删除
                  </button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>

      {persons.length === 0 && (
        <div className="text-center py-6 text-gray-500 text-sm">
          暂无参与人员，请添加人员开始使用
        </div>
      )}
    </div>
  );
};

export default PersonManager;
