import React, { useState, useRef, useEffect } from 'react';
import { Terminal } from 'xterm';
import { FitAddon } from 'xterm-addon-fit';
import { WebLinksAddon } from 'xterm-addon-web-links';
import { io } from 'socket.io-client';
import 'xterm/css/xterm.css';
import './SSHConnect.css';

const BACKEND_URL = 'http://localhost:5000'; // Make sure this matches your Flask server

const SSHConnect = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [socket, setSocket] = useState(null);
  const terminalRef = useRef(null);
  const xtermRef = useRef(null);
  const fitAddonRef = useRef(null);

  const initializeTerminal = () => {
    return new Promise((resolve) => {
      if (!terminalRef.current) {
        resolve(null);
        return;
      }

      const terminal = new Terminal({
        cursorBlink: true,
        fontSize: 14,
        fontFamily: 'Menlo, Monaco, "Courier New", monospace',
        theme: {
          background: '#1e1e1e',
          foreground: '#f0f0f0',
          cursor: '#87d7ff',
          selection: 'rgba(135, 215, 255, 0.3)',
          black: '#000000',
          red: '#ff5f5f',
          green: '#87d7ff',
          yellow: '#ffbd2e',
          blue: '#2b6cb0',
          magenta: '#c678dd',
          cyan: '#56b6c2',
          white: '#d0d0d0',
        },
        allowTransparency: true,
        scrollback: 1000,
        cols: 80,
        rows: 24,
        convertEol: true,
        disableStdin: false,
        cursorStyle: 'block',
        cursorBlink: true,
      });

      const fitAddon = new FitAddon();
      terminal.loadAddon(fitAddon);
      terminal.loadAddon(new WebLinksAddon());

      terminal.open(terminalRef.current);
      
      setTimeout(() => {
        try {
          fitAddon.fit();
          xtermRef.current = terminal;
          fitAddonRef.current = fitAddon;

          resolve({ terminal, fitAddon });
        } catch (error) {
          console.error('Terminal initialization error:', error);
          resolve(null);
        }
      }, 100);
    });
  };

  const connectSocket = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await initializeTerminal();
      if (!result) {
        throw new Error('Failed to initialize terminal');
      }

      const { terminal, fitAddon } = result;

      const newSocket = io(BACKEND_URL, {
        transports: ['websocket'],
        reconnection: true,
        reconnectionAttempts: 3,
        reconnectionDelay: 1000,
        path: '/socket.io',
      });

      // Handle terminal input
      terminal.onData((data) => {
        if (newSocket?.connected) {
          console.log('Sending input:', data);
          newSocket.emit('input', { command: data });
        }
      });

      newSocket.on('connect', () => {
        console.log('Socket connected');
        setIsConnected(true);
        setIsLoading(false);
        setSocket(newSocket);
        
        terminal.clear();
        terminal.write('Connected to InterBank Terminal\r\n');
        terminal.focus();

        // Send initial terminal size
        const { rows, cols } = terminal;
        newSocket.emit('resize', { rows, cols });
      });

      newSocket.on('output', (data) => {
        console.log('Received output:', data);
        if (data.data) {
          // Clean and write the output
          const cleanOutput = data.data
            .replace(/\[\?2004[hl]/g, '')
            .replace(/\]0;/g, '');
          terminal.write(cleanOutput);
        }
      });

      newSocket.on('error', (data) => {
        console.error('Socket error:', data);
        setError(data.data || 'Connection error');
        terminal.write(`\r\nError: ${data.data}\r\n`);
      });

      newSocket.on('disconnect', () => {
        console.log('Socket disconnected');
        setIsConnected(false);
        terminal.write('\r\nDisconnected from server\r\n');
      });

      // Handle window resize
      const handleResize = () => {
        fitAddon.fit();
        const { rows, cols } = terminal;
        if (newSocket?.connected) {
          newSocket.emit('resize', { rows, cols });
        }
      };

      window.addEventListener('resize', handleResize);

    } catch (error) {
      console.error('Connection error:', error);
      setError(error.message || 'Failed to connect');
      setIsLoading(false);
    }
  };

  const disconnectSocket = () => {
    if (socket) {
      socket.disconnect();
    }
    setIsConnected(false);
    setSocket(null);
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (socket) {
        socket.disconnect();
      }
      if (xtermRef.current) {
        xtermRef.current.dispose();
      }
    };
  }, []);

  return (
    <div className="ssh-connect-container">
      <div className="ssh-connect-content">
        <div className="ssh-terminal-window">
          <div className="terminal-container">
            <div className="terminal-header">
              <div className="terminal-controls">
                {isConnected && (
                  <span 
                    className="control close" 
                    onClick={disconnectSocket}
                    title="Disconnect"
                  ></span>
                )}
                <span className="control minimize"></span>
                <span className="control maximize"></span>
              </div>
              <span className="terminal-title">InterBank Terminal</span>
            </div>
            <div className="terminal-body" ref={terminalRef}></div>
          </div>
          {!isConnected && (
            <div className="ssh-connect-prompt">
              <div className="connection-info">
                <h3>InterBank Terminal Connection</h3>
                <p className={`status ${isLoading ? 'connecting' : error ? 'error' : 'disconnected'}`}>
                  Status: {isLoading ? 'Connecting...' : error ? 'Error' : 'Disconnected'}
                </p>
                {error && <p className="error-message">{error}</p>}
              </div>
              <button 
                className={`ssh-connect-button ${isLoading ? 'loading' : ''}`}
                onClick={connectSocket}
                disabled={isLoading}
              >
                {isLoading ? 'Connecting...' : 'Connect to Terminal'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SSHConnect; 