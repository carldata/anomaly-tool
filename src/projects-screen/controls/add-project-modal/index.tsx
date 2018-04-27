import * as React from 'react';
import { Modal, Button, Form, FormGroup, FormControl, Col, ControlLabel, ButtonGroup } from 'react-bootstrap';
import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from "redux";
import { projectScreenActionCreators } from '../../action-creators';
import * as _ from 'lodash';
import { IProject } from '../../state';

interface IAddProjectModalComponentProps {
  showModal: boolean;
  id: string;
  name: string;
  site: string;
  raw: string;
  final: string;
  supportingChannels? : string[];
}

interface IAddProjectModalComponentActionCreators {
  addProject: (e: IProject) => any;
  hideModal?: () => any;
}

interface IAddProjectModalComponentState {
  showModal: boolean;
  name: string;
  site: string;
  raw: string;
  final: string;
}

class AddProjectModalComponent extends React.Component<IAddProjectModalComponentProps & IAddProjectModalComponentActionCreators, IAddProjectModalComponentState> {
  constructor(props: IAddProjectModalComponentProps & IAddProjectModalComponentActionCreators) {
    super(props)

    this.state = {
      showModal: false,
      name: '',
      site: '',
      raw: '',
      final: ''
    } as IAddProjectModalComponentState;

    this.approveAddProject = this.approveAddProject.bind(this);
  }

  componentWillReceiveProps(nextProps: IAddProjectModalComponentProps & IAddProjectModalComponentActionCreators) {
    this.setState({
      showModal: nextProps.showModal,
      name: nextProps.name,
      site: nextProps.site,
      raw: nextProps.raw,
      final: nextProps.final
    });
  }

  render() {
    return <Modal show={this.state.showModal} onHide={()=>this.props.hideModal()}>
      <Modal.Body>
        <Form horizontal>
          <FormGroup>
            <Col sm={4} componentClass={ControlLabel}>
              Name:
            </Col>
            <Col sm={6}>
              <FormControl id='txtProjectName' type='text' placeholder='Enter Name' onChange={(e) => this.setState({ name: (e.target as HTMLInputElement).value })} value={this.state.name}></FormControl>
            </Col>
          </FormGroup>
          <FormGroup>
            <Col sm={4} componentClass={ControlLabel}>
              Site:
            </Col>
            <Col sm={6}>
              <FormControl id='txtProjectSite' type='text' placeholder='Enter Site' onChange={(e) => this.setState({ site: (e.target as HTMLInputElement).value })} value={this.state.site}></FormControl>
            </Col>
          </FormGroup>
          <FormGroup>
            <Col sm={4} componentClass={ControlLabel}>
              Source Channel:
            </Col>
            <Col sm={6}>
              <FormControl id='txtProjectSourceChannel' type='text' placeholder='Enter Channel' onChange={(e) => this.setState({ raw: (e.target as HTMLInputElement).value })} value={this.state.raw} ></FormControl>
            </Col>
          </FormGroup>
          <FormGroup>
            <Col sm={4} componentClass={ControlLabel}>
              Final Channel:
            </Col>
            <Col sm={6}>
              <FormControl id='txtProjectFinalChannel' type='text' placeholder='Enter Channel' onChange={(e) => this.setState({ final: (e.target as HTMLInputElement).value })} value={this.state.final} ></FormControl>
            </Col>
          </FormGroup>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button id='btnApproveAddProjectModal' bsStyle='primary' onClick={this.approveAddProject} >
          Add Project
        </Button>
        <Button id='btnCancelAddProjectModal' onClick={()=>this.props.hideModal()}>
          Cancel
        </Button>
      </Modal.Footer>
    </Modal>
  }

  approveAddProject() {
    let project: IProject = {
      id: this.props.id,
      name: this.state.name,
      site: this.state.site,
      final: this.state.final,
      raw: this.state.raw,
      supportingChannels: [],
    };

    //console.log('project to add/edit: ', project);
    this.props.addProject(project)
    this.props.hideModal();
  }
}

export const AddProjectModal = AddProjectModalComponent;