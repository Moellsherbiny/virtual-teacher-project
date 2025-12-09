
export const Avatar: React.FC<{ type: 'user' | 'bot' }> = ({ type }) => (
  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium flex-shrink-0 ${
    type === 'bot' 
      ? 'bg-gradient-to-br from-blue-500 to-purple-600 text-white' 
      : 'bg-gradient-to-br from-gray-300 to-gray-400 dark:from-gray-600 dark:to-gray-700 text-gray-700 dark:text-gray-200'
  }`}>
    {type === 'bot' ? '🤖' : '👤'}
  </div>
);