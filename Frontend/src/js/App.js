import React from 'react';
import {Button, Icon, Message, Form, Grid} from 'semantic-ui-react';
import ConfigDialog from './ConfigDialog';
import { post, responseIsJson, getFileNameFromResponse, saveBlob } from './utils';
import cloneDeep from 'lodash/cloneDeep';

class App extends React.Component {
  constructor(props) {
    super(props);
    let config = localStorage.getItem('config');
    config = config ? JSON.parse(config) : {
      fileType: 'pdf',
      paperType: 'a4',
      paperOrientation: 'portrait',
      imageType: 'jpg',
      paperWidth: null,
      paperHeight: null,
      paperUnitName: 'cm',
      imageWidth: null,
      imageHeight: null
    };
    this.state = {
      url: '',
      message: '',
      loading: false,
      showConfig: false,
      config: config,
      configCopy: cloneDeep(config)
    };
  }

  handleUrlChanged(e) {
    this.setState({url: e.target.value, message: ''});
  }

  handleShowConfigClick(e) {
    e.preventDefault();
    if (this.state.loading) {
      return;
    }
    this.setState({showConfig: true, message: '', configCopy: cloneDeep(this.state.config)});
  }

  handleDownloadClick(e) {
    let { config, url, loading } = this.state;
    if (!url) {
      this.setState({message: 'Website URL is empty.'});
      return;
    }
    if (loading) {
      return;
    }
    config.url = url;
    let fileName = `File.${config.fileType}`;
    let self = this;
    this.setState({loading: true, message: ''});
    post('api/converter/converthtmltopdf', config)
      .then(response => {
        if (!response.ok) {
          throw response.statusText || 'Server Error.';
        }
        if (responseIsJson(response)) {
          throw response.json();
        }
        fileName = getFileNameFromResponse(response);
        return response.blob();
      })
      .then(blob => {
        if (blob.size > 0) {
          saveBlob(blob, fileName);
        } else {
          self.setState({message: 'Response is empty.'});
        }
        self.setState({loading: false});
      })
      .catch(error => {
        if (typeof(error) == 'string') {
          self.setState({message: error, loading: false});
        } else {
          error.then(r => {
            if (r.message) {
              self.setState({message: r.message});
            }
            self.setState({loading: false});
          });
        }
      });
  }

  handleCancelDialogClick() {
    this.setState({showConfig: false});
  }

  handleSaveDialogClick(config) {
    this.setState({showConfig: false, config: cloneDeep(config)});
    localStorage.setItem('config', JSON.stringify(config));
  }

  render() {
    const { url, loading, showConfig, configCopy, message } = this.state;
    const fileType = (configCopy.fileType.toLowerCase() == 'image' && configCopy.imageType) ? configCopy.imageType.toUpperCase() : 'PDF';

    return (<div className="page-content">
      <Form as="form" noValidate>
        <Grid>
          <Grid.Row>
            <Grid.Column width={15} verticalAlign="middle">
              <div className="field">
                <div className="ui action input">
                  <input
                    name="url"
                    value={url}
                    type="text"
                    placeholder="Website URL"
                    autoComplete="off"
                    disabled={loading}
                    onChange={this.handleUrlChanged.bind(this)}
                  />
                  <Icon
                    name={loading ? 'cog grey' : 'cog blue'}
                    className="cog"
                    size="large"
                    onClick={this.handleShowConfigClick.bind(this)} />
                  <Button
                    primary
                    onClick={this.handleDownloadClick.bind(this)}
                    disabled={loading}>Download {fileType}</Button>
                </div>
              </div>
            </Grid.Column>
            <Grid.Column width={1} verticalAlign="middle">
              <div className="field">
                {loading && <Icon loading name="spinner" className="spinner" size="large"/>}
              </div>
            </Grid.Column>
          </Grid.Row>
          <Grid.Row>
            <Grid.Column width={15} verticalAlign="middle">
              {message && <Message info><pre>{message}</pre></Message>}
            </Grid.Column>
            <Grid.Column width={1} verticalAlign="middle">
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Form>
      <ConfigDialog
        show={showConfig}
        data={configCopy}
        cancelCloseDialog={this.handleCancelDialogClick.bind(this)}
        saveCloseDialog={this.handleSaveDialogClick.bind(this)} />
    </div>);
  }
}

export default App;