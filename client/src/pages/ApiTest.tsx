import { useEffect, useState } from 'react';

const App = () => {
  const [apiMessage, setApiMessage] = useState('');

  useEffect(() => {
    const checkApiConnection = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/test');
        const data = await response.json();
        setApiMessage(data.message);
      } catch (error) {
        setApiMessage('Failed to connect to API');
        console.error('Error connecting to API:', error);
      }
    };

    checkApiConnection();
  }, []);

  return (
    <div>
      <h1>API Connection Status</h1>
      <p>{apiMessage}</p>
    </div>
  );
};

export default App;