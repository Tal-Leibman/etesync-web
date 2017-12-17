import * as React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';

import Container from './widgets/Container';
import ExternalLink from './widgets/ExternalLink';
import SyncGate from './SyncGate';
import LoginForm from './components/LoginForm';

import { store, StoreState, CredentialsType } from './store';
import { fetchCredentials } from './store/actions';

import * as C from './constants';

class Root extends React.PureComponent {
  props: {
    credentials: CredentialsType;
  };

  constructor(props: any) {
    super(props);
    this.onFormSubmit = this.onFormSubmit.bind(this);
  }

  onFormSubmit(username: string, password: string, encryptionPassword: string, serviceApiUrl?: string) {
    serviceApiUrl = serviceApiUrl ? serviceApiUrl : C.serviceApiBase;
    store.dispatch(fetchCredentials(username, password, encryptionPassword, serviceApiUrl));
  }

  render() {
    if (this.props.credentials.value === null) {
      const style = {
        isSafe: {
          textDecoration: 'none',
          display: 'block',
        },
        divider: {
          margin: '30px 0',
          color: '#00000025',
        }
      };

      return (
        <Container style={{maxWidth: 400}}>
          <h2>Please Log In</h2>
          <LoginForm
            onSubmit={this.onFormSubmit}
            error={this.props.credentials.error}
            loading={this.props.credentials.fetching}
          />
          <hr style={style.divider}/>
          <ul>
            <li><ExternalLink style={style.isSafe} href={C.faq + '#web-client'}>
                Is the web client safe to use?
            </ExternalLink></li>
            <li><ExternalLink style={style.isSafe} href={C.sourceCode}>Source code</ExternalLink></li>
          </ul>
        </Container>
      );
    }

    return (
      <SyncGate etesync={this.props.credentials.value} />
    );
  }
}

const mapStateToProps = (state: StoreState) => {
  return {
    credentials: state.credentials,
  };
};

// FIXME: withRouter is only needed here because of https://github.com/ReactTraining/react-router/issues/5795
export default withRouter(connect(
  mapStateToProps
)(Root));