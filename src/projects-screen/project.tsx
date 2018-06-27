import * as React from 'react';
import { Col, FormControl, FormGroup, ListGroupItem, Button } from 'react-bootstrap';
import { IProject } from '../models';

interface IProjectComponentActionCreators {
  goToProjectAnomalies: () => any;
  deleteProject: (projectId: string) => any;
}

export class ProjectComponent extends React.Component<IProject & IProjectComponentActionCreators> {
  public render() {
    return <ListGroupItem>
      <FormGroup>
        <Col sm={10}>
          <Button id='btnDeleteProject' onClick={() => { this.props.goToProjectAnomalies(); }}><strong> {this.props.projectName}</strong></Button>
        </Col>
        <Col sm={2}>
          <Button id='btnDeleteProject' bsStyle='primary' onClick={() => {
            this.props.deleteProject(this.props.id);
          }}>Delete</Button>
        </Col>
      </FormGroup>
    </ListGroupItem>;
  }
}