import * as _ from 'lodash';
import * as React from 'react';
import { Button, Form, FormGroup, ListGroup } from 'react-bootstrap';
import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';
import { IState } from '../state';
import { projectScreenActionCreators, IGetAllProjectsActionCreator, getAllProjects } from './action-creators';
import { ProjectComponent } from './project';
import { IProject } from './models/project';
import { AddProjectModal } from './controls/add-project-modal';
import { ISite, IChannel } from '../model';
import { ModalContainer } from '../components/modal';

interface IProjectComponentProps {
  projects: IProject[];
}

interface IProjectComponentActionCreators {
  goToAnomaliesScreen: (project: IProject) => any;
  getAllProjects: IGetAllProjectsActionCreator;
  addProjectStart: (project: IProject) => any;
  getSites: (db: string) => any;
  getChannels: (siteId: string) => any;
  showAddProject: () => any;
}

class ProjectsComponent extends React.Component<IProjectComponentProps & IProjectComponentActionCreators> {
  constructor(props: IProjectComponentProps & IProjectComponentActionCreators) {
    super(props);
  }

  public componentDidMount() {
    this.props.getAllProjects();
  }

  public render() {
    return <>
      <ModalContainer />
      <div className='container'>
        <Form horizontal>
          <FormGroup>
            <ListGroup>
              {_.map(this.props.projects, (project: IProject, index) => {
                return <ProjectComponent
                  {...project}
                  key={index}
                  goToProjectAnomalies={() => {
                    this.props.goToAnomaliesScreen(_.find(this.props.projects, (proj) => proj.id === project.id)); 
                  }} />;
              })}
            </ListGroup>
          </FormGroup>
          <FormGroup>
            <Button id='btnAddProject' bsStyle='primary' onClick={() => this.props.showAddProject()}>Add Project</Button>
          </FormGroup>
        </Form>
        <AddProjectModal></AddProjectModal>
      </div>
    </>;
  }

}

function mapStateToProps(state: IState) {
  return {
    projects: state.projectsScreen.projects,
  };
}

function matchDispatchToProps(dispatch: Dispatch<{}>) {
  return bindActionCreators({
    goToAnomaliesScreen: projectScreenActionCreators.goToAnomaliesScreen,
    getAllProjects,
    addProjectStart: projectScreenActionCreators.addProjectStart,
    getSites: projectScreenActionCreators.getSites,
    getChannels: projectScreenActionCreators.getChannels,
    showAddProject: projectScreenActionCreators.showAddProject,
  }, dispatch);
}

export default connect(mapStateToProps, matchDispatchToProps)(ProjectsComponent);