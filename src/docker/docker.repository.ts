import fs from 'fs';
import FormData from 'form-data';
import { IDockerRepository, IContainer, IContainerConfig } from './interfaces';
import axios from '../utils/axios';
// implements IDockerRepository
export default class DockerRepository implements IDockerRepository {
  async createContainer(data: Partial<IContainerConfig>): Promise<string> {
    const response = await axios.post(`/containers/create`, { ...data });
    return response.data.Id;
  }

  async getOneContainer(id: string): Promise<IContainer> {
    const { data } = await axios.get(`/containers/${id}/json`);
    return data;
  }

  async deleteContainer(
    id: string,
    removeVolumes = false,
    force = false,
    link = false
  ): Promise<void> {
    await axios.delete(`/containers/${id}`, {
      params: {
        v: removeVolumes,
        force,
        link,
      },
    });
  }

  async startContainer(id: string): Promise<void> {
    await axios.post(`/containers/${id}/start`);
  }

  async buildImage(
    dockerfileContext: string,
    file: fs.ReadStream
  ): Promise<void> {
    const data = new FormData();
    data.append('file', file);
    await axios({
      method: 'POST',
      url: '/build',
      data,
      params: {
        dockerfile: dockerfileContext,
      },
      headers: {
        'Content-type': 'application/x-tar"',
      },
    });
  }
}
