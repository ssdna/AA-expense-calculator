import React from 'react';

const Settlement = ({ settlement }) => {
  if (settlement.length === 0) {
    return (
      <div className="card">
        <h2 className="text-lg font-bold mb-3 text-gray-800">结算方案</h2>
        <div className="text-center py-6 text-gray-500">
          <div className="text-4xl mb-3">✅</div>
          <div className="text-base font-medium">账目已平衡</div>
          <div className="text-xs">所有费用已正确分摊，无需额外转账</div>
        </div>
      </div>
    );
  }

  return (
    <div className="card">
      <h2 className="text-lg font-bold mb-3 text-gray-800">结算方案</h2>
      
      <div className="space-y-2">
        {settlement.map((item, index) => (
          <div key={index} className="p-2 md:p-3 bg-gradient-to-r from-orange-50 to-red-50 rounded-lg border-l-4 border-orange-400">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-1.5">
              <div className="flex items-center space-x-2 flex-1">
                <div className="w-6 h-6 bg-orange-500 text-white rounded-full flex items-center justify-center text-xs font-medium touch-target">
                  {index + 1}
                </div>
                <div className="flex-1">
                  <div className="font-medium text-gray-800 text-xs md:text-sm">
                    <span className="text-red-600">{item.from}</span>
                    <span className="mx-1 text-gray-500">→</span>
                    <span className="text-green-600">{item.to}</span>
                  </div>
                  <div className="text-xs text-gray-600">转账金额</div>
                </div>
              </div>
              <div className="text-center md:text-right">
                <div className="text-lg font-bold text-orange-600">
                  ¥{item.amount.toFixed(2)}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 p-3 bg-blue-50 rounded-lg">
        <div className="text-xs text-blue-800">
          <div className="font-medium mb-1">💡 结算说明：</div>
          <div>按照上述方案转账后，所有人的费用将完全平衡。建议使用支付宝、微信等电子支付方式进行转账。</div>
        </div>
      </div>
    </div>
  );
};

export default Settlement;
