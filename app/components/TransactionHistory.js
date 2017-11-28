import React, { Component } from 'react';
import { connect } from 'react-redux';
import { syncTransactionHistory } from "../components/NetworkSwitch";
import { shell } from 'electron';
import Copy from 'react-icons/lib/md/content-copy';
import { clipboard } from 'electron';

// TODO: make this a user setting
const getExplorerLink = (net, explorer, txid) => {
  let base;
  if (explorer === "Neotracker"){
    if (net === "MainNet" || net === "MainNet-A"){
      base = "https://neotracker.io/tx/";
    } else {
      base = "https://testnet.neotracker.io/tx/";
    }
  }
  else {
    if (net === "MainNet"  || net === "MainNet-A"){
      base = "http://antcha.in/tx/hash/";
    } else {
      base = "http://testnet.antcha.in/tx/hash/";
    }
  }
  return base + txid;
}

// helper to open an external web link
const openExplorer = (srcLink) => {
  shell.openExternal(srcLink);
}

class TransactionHistory extends Component {

  componentDidMount = () => {
    syncTransactionHistory(this.props.dispatch, this.props.net, this.props.address);
  }

  render = () =>
    <div id="transactionInfo">
      <ul id="transactionList">
        {this.props.transactions.map((t) => {
          const formatGas = (gas) => Math.floor(parseFloat(gas) * 10000) / 10000;
          let formatAmount = t.type === "NEO" ? parseInt(t.amount) : formatGas(t.amount);
          return (<li key={t.txid}>
              <div className="txid" onClick={() => openExplorer(getExplorerLink(this.props.net, this.props.explorer, t.txid))}>
                {t.txid.substring(0,32)}</div><div className="amount">{formatAmount} {t.type}
              </div></li>);
        })}
      </ul>
    </div>;
}

const mapStateToProps = (state) => ({
  address: state.account.address,
  net: state.metadata.network,
  transactions: state.wallet.transactions,
  explorer: state.metadata.blockExplorer
});

TransactionHistory = connect(mapStateToProps)(TransactionHistory);

export default TransactionHistory;
