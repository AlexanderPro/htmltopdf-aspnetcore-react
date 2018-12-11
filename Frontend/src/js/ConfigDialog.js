import React from 'react';
import {Button, Modal, Dropdown, Grid, Input, Form} from 'semantic-ui-react';
import isEqual from 'lodash/isEqual';
import cloneDeep from 'lodash/cloneDeep';

class ConfigDialog extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      data: cloneDeep(this.props.data),
      show: this.props.show,
      fileTypes: [
        {text: 'Pdf', value: 'pdf'},
        {text: 'Image', value: 'image'}
      ],
      paperTypes: [
        {text: 'Custom', value: 'custom'},
        {text: 'A3', value: 'a3'},
        {text: 'A4', value: 'a4'},
        {text: 'A5', value: 'a5'},
        {text: 'Legal', value: 'legal'},
        {text: 'Letter', value: 'letter'},
        {text: 'Tabloid', value: 'tabloid'},
      ],
      paperOrientations: [
        {text: 'Portrait', value: 'portrait'},
        {text: 'Landscape', value: 'landscape'}
      ],
      paperUnitNames: [
        {text: 'CM', value: 'cm'},
        {text: 'IN', value: 'in'}
      ],
      imageTypes: [
        {text: 'JPG', value: 'jpg'},
        {text: 'PNG', value: 'png'}
      ]
    };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.show != this.props.show || !isEqual(nextProps.data, this.props.data)) {
      this.setState({
        show: nextProps.show,
        data: cloneDeep(nextProps.data)
      });
    }
  }

  handleSaveClick(e) {
    e.preventDefault();
    this.props.saveCloseDialog(cloneDeep(this.state.data));
  }

  handleCancelClick(e) {
    e.preventDefault();
    this.props.cancelCloseDialog();
  }

  updateData(e, obj) {
    const { data } = this.state;
    data[obj.name] = (typeof(obj.value) == 'string' && obj.value.includes(',')) ? obj.value.replace(/,/g, '.') : obj.value;
    this.setState({data: data});
  }

  render() {
    let { data, show, fileTypes, paperTypes, paperOrientations, imageTypes, paperUnitNames } = this.state;

    return (
      <div>
        <Modal open={show} closeIcon onClose={this.handleCancelClick.bind(this)}>
          <Modal.Header>Settings</Modal.Header>
          <Modal.Content>
            <div>
              <Form as="form" noValidate>
                <Grid>
                  <Grid.Row>
                    <Grid.Column width={16} verticalAlign="middle">
                      <Grid>
                        <Grid.Row>
                          <Grid.Column width={16} verticalAlign="middle">
                            <div className="field">
                              <label>File type</label>
                              <Dropdown options={fileTypes}
                                fluid search selection
                                name="fileType"
                                value={data.fileType}
                                onChange={this.updateData.bind(this)}/>
                            </div>
                          </Grid.Column>
                        </Grid.Row>
                      </Grid>
                    </Grid.Column>
                  </Grid.Row>
                  {data.fileType == 'pdf' && <Grid.Row>
                    <Grid.Column width={16} verticalAlign="middle">
                      <Grid>
                        <Grid.Row>
                          <Grid.Column width={16} verticalAlign="middle">
                            <div className="field">
                              <label>Paper orientation</label>
                              <Dropdown options={paperOrientations}
                                fluid search selection
                                name="paperOrientation"
                                value={data.paperOrientation}
                                onChange={this.updateData.bind(this)}/>
                            </div>
                          </Grid.Column>
                        </Grid.Row>
                      </Grid>
                    </Grid.Column>
                  </Grid.Row>}
                  {data.fileType == 'pdf' && <Grid.Row>
                    <Grid.Column width={16} verticalAlign="middle">
                      <Grid>
                        <Grid.Row>
                          <Grid.Column width={16} verticalAlign="middle">
                            <div className="field">
                              <label>Paper type</label>
                              <Dropdown options={paperTypes}
                                fluid search selection
                                name="paperType"
                                value={data.paperType}
                                onChange={this.updateData.bind(this)}/>
                            </div>
                          </Grid.Column>
                        </Grid.Row>
                      </Grid>
                    </Grid.Column>
                  </Grid.Row>}
                  {data.fileType == 'pdf' && data.paperType == 'custom' && <Grid.Row>
                    <Grid.Column width={16} verticalAlign="middle">
                      <Grid>
                        <Grid.Row>
                          <Grid.Column width={6} verticalAlign="middle">
                            <div className="field">
                              <label>Unit name</label>
                              <Dropdown options={paperUnitNames}
                                fluid search selection
                                name="paperUnitName"
                                value={data.paperUnitName}
                                onChange={this.updateData.bind(this)}/>
                            </div>
                          </Grid.Column>
                          <Grid.Column width={5} verticalAlign="middle">
                            <div className="field">
                              <label>Width</label>
                              <Input fluid name="paperWidth" value={data.paperWidth} onChange={this.updateData.bind(this)}/>
                            </div>
                          </Grid.Column>
                          <Grid.Column width={5} verticalAlign="middle">
                            <div className="field">
                              <label>Height</label>
                              <Input fluid name="paperHeight" value={data.paperHeight} onChange={this.updateData.bind(this)}/>
                            </div>
                          </Grid.Column>
                        </Grid.Row>
                      </Grid>
                    </Grid.Column>
                  </Grid.Row>}
                  {data.fileType == 'image' && <Grid.Row>
                    <Grid.Column width={16} verticalAlign="middle">
                      <Grid>
                        <Grid.Row>
                          <Grid.Column width={16} verticalAlign="middle">
                            <div className="field">
                              <label>Image</label>
                              <Dropdown options={imageTypes}
                                fluid search selection
                                name="imageType"
                                value={data.imageType}
                                onChange={this.updateData.bind(this)}/>
                            </div>
                          </Grid.Column>
                        </Grid.Row>
                      </Grid>
                    </Grid.Column>
                  </Grid.Row>}
                  {data.fileType == 'image' && <Grid.Row>
                    <Grid.Column width={16} verticalAlign="middle">
                      <Grid>
                        <Grid.Row>
                          <Grid.Column width={8} verticalAlign="middle">
                            <div className="field">
                              <label>Width px (Optional)</label>
                              <Input fluid name="imageWidth" value={data.imageWidth} onChange={this.updateData.bind(this)}/>
                            </div>
                          </Grid.Column>
                          <Grid.Column width={8} verticalAlign="middle">
                            <div className="field">
                              <label>Height px (Optional)</label>
                              <Input fluid name="imageHeight" value={data.imageHeight} onChange={this.updateData.bind(this)}/>
                            </div>
                          </Grid.Column>
                        </Grid.Row>
                      </Grid>
                    </Grid.Column>
                  </Grid.Row>}
                </Grid>
              </Form>
            </div>
          </Modal.Content>
          <Modal.Actions>
            <Button
              content="Cancel"
              onClick={this.handleCancelClick.bind(this)}
            />
            <Button
              primary
              content="Save"
              onClick={this.handleSaveClick.bind(this)}
            />
          </Modal.Actions>
        </Modal>
      </div>
    );
  }
}

export default ConfigDialog;