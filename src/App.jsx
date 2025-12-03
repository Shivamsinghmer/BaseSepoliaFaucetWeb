import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Wallet, ArrowRight, Activity, Box, Shield, Zap } from 'lucide-react';
import './App.css';

// Mock data for recent claims
const MOCK_CLAIMS = [
  { hash: '0x7a...3b21', time: '2 mins ago', amount: '0.0001 ETH' },
  { hash: '0x8b...4c32', time: '5 mins ago', amount: '0.0001 ETH' },
  { hash: '0x9c...5d43', time: '8 mins ago', amount: '0.0001 ETH' },
  { hash: '0x1d...6e54', time: '12 mins ago', amount: '0.0001 ETH' },
];


function App() {
  const [walletAddress, setWalletAddress] = useState('');
  const [status, setStatus] = useState({ type: '', message: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [recentClaims, setRecentClaims] = useState(MOCK_CLAIMS);

  // Simulate live feed updates
  useEffect(() => {
    const interval = setInterval(() => {
      const newClaim = {
        hash: `0x${Math.random().toString(16).substr(2, 2)}...${Math.random().toString(16).substr(2, 4)}`,
        time: 'Just now',
        amount: '0.0001 ETH'
      };
      setRecentClaims(prev => [newClaim, ...prev.slice(0, 3)]);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        setWalletAddress(accounts[0]);
        setStatus({ type: '', message: '' });
      } catch (error) {
        setStatus({ type: 'error', message: 'Failed to connect wallet.' });
      }
    } else {
      setStatus({ type: 'error', message: 'Please install MetaMask or another wallet.' });
    }
  };

  const requestFunds = async () => {
    if (!walletAddress) return;

    setIsLoading(true);
    setStatus({ type: '', message: '' });

    try {
      const response = await fetch('/api/faucet', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ address: walletAddress, amount: 0.0001 }),
      });

      const data = await response.json();

      if (data.success) {
        setStatus({
          type: 'success',
          message: `Success! Transaction Hash: ${data.transactionHash}`
        });
      } else {
        setStatus({
          type: 'error',
          message: data.error || 'Something went wrong.'
        });
      }
    } catch (error) {
      setStatus({ type: 'error', message: 'Failed to communicate with server.' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container">
      {/* Background Shapes & Coins */}
      <div className="bg-shape shape-1" />
      <div className="bg-shape shape-2" />

      {/* Navbar */}
      <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.25rem 0' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 'bold', fontSize: '1.2rem' }}>
          <Box className="text-primary" size={24} color="var(--primary)" />
          <span>Base Sepolia Faucet</span>
        </div>
        {!walletAddress ? (
          <button className="btn-secondary" onClick={connectWallet} style={{ width: 'auto', alignItems: 'center', gap: '0.5rem', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <Wallet size={25} style={{ marginRight: '0.5rem', verticalAlign: 'middle' }} />
            <p style={{ fontSize: '1rem', fontWeight: 'bold', color: 'var(--text-main)', display: "flex" }}>Connect Wallet</p>
          </button>
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <span className="address" style={{ fontSize: '1rem' }}>
              {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
            </span>
            <button className="btn-secondary" onClick={() => setWalletAddress('')} style={{ width: 'auto' }}>
              Disconnect
            </button>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="hero-section"
      >
        <h1>Claim Base Sepolia ETH</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '1.2rem', maxWidth: '600px' }}>
          The premium faucet for your Web3 development needs. Fast, reliable, and built for the Base ecosystem.
        </p>
      </motion.div>

      {/* Main Content Grid */}
      <div className="grid-layout">
        {/* Faucet Card */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="glass-card"
        >
          <h2><Zap size={24} style={{ verticalAlign: 'middle', marginRight: '0.5rem', color: 'var(--primary)' }} /> Faucet</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>Wallet Address</label>
              <input
                type="text"
                className="glass-input"
                placeholder="0x..."
                value={walletAddress}
                onChange={(e) => setWalletAddress(e.target.value)}
              />
            </div>

            <button
              className="btn-primary"
              onClick={requestFunds}
              disabled={isLoading || !walletAddress}
            >
              {isLoading ? 'Processing...' : 'Claim 0.0001 ETH'}
            </button>

            {status.message && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className={`status-message ${status.type}`}
              >
                {status.type === 'success' ? (
                  <>
                    Funds sent! <br />
                    <a
                      href={`https://sepolia.basescan.org/tx/${status.message.split(': ')[1]}`}
                      target="_blank"
                      rel="noreferrer"
                    >
                      View on Explorer <ArrowRight size={14} style={{ verticalAlign: 'middle' }} />
                    </a>
                  </>
                ) : (
                  status.message
                )}
              </motion.div>
            )}

            <div style={{ fontSize: '1.25rem', paddingTop: '4rem', color: 'var(--text-muted)', textAlign: 'center' }}>
              Limit: 1000 request / day • Amount: 0.0001 ETH
            </div>
          </div>
        </motion.div>

        {/* Live Feed & Info */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          {/* Recent Claims */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="glass-card"
          >
            <h2><Activity size={24} style={{ verticalAlign: 'middle', marginRight: '0.5rem', color: 'var(--secondary)' }} /> Recent Claims</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {recentClaims.map((claim, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '0.5rem', borderBottom: '1px solid var(--glass-border)' }}
                >
                  <span style={{ fontFamily: 'monospace', color: 'var(--primary)' }}>{claim.hash}</span>
                  <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>{claim.time}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* How it works */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="glass-card"
          >
            <h2><Shield size={24} style={{ verticalAlign: 'middle', marginRight: '0.5rem', color: '#10b981' }} /> How It Works</h2>
            <div style={{ display: 'flex', justifyContent: 'space-between', textAlign: 'center', gap: '1rem' }}>
              <div>
                <div style={{ background: 'rgba(255,255,255,0.1)', width: '40px', height: '40px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 0.5rem' }}>1</div>
                <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Connect Wallet</span>
              </div>
              <div>
                <div style={{ background: 'rgba(255,255,255,0.1)', width: '40px', height: '40px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 0.5rem' }}>2</div>
                <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Enter Address</span>
              </div>
              <div>
                <div style={{ background: 'rgba(255,255,255,0.1)', width: '40px', height: '40px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 0.5rem' }}>3</div>
                <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Get Funds</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
      <footer style={{ marginTop: 'auto', paddingTop: '4rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
        <p>Powered by Base • Built for Developers</p>
      </footer>
    </div>
  );
}

export default App;