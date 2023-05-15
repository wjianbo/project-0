import AsyncStorage from '@react-native-async-storage/async-storage';
import { Buffer } from 'buffer';

export default class GitHubAPI {
    BASE_URL: string = 'https://api.github.com';
    token!: string;
    owner!: string;
    repo!: string;

    init(username: string, token: string, repo: string) {
        this.token = token;
        this.owner = username;
        this.repo = repo;
    }

    getUsername() {
        return this.owner;
    }

    getRepo() {
        return this.repo;
    }

    getToken() {
        return this.token;
    }

/*     async getUsername() {
        if (this.owner) {
            return this.owner;
        }

        const url = `${this.BASE_URL}/user`;

        try {
            const response = await fetch(url, {
                headers: {
                    Authorization: `token ${this.token}`
                }
            });

            const data = await response.json();
            this.owner = data.login;
            return this.owner;
        } catch (error) {
            console.error(error);
            return null;
        }
    }
 */
    async getRepositories() {
        const username = await this.getUsername();
        const url = `${this.BASE_URL}/users/${username}/repos`;

        try {
            const response = await fetch(url, {
                headers: {
                    Authorization: `token ${this.token}`
                }
            });

            const data = await response.json();
            return data;
        } catch (error) {
            console.error(error);
            return null;
        }
    }

    async getRepositoryContent(path = '') {
        const url = `${this.BASE_URL}/repos/${this.owner}/${this.repo}/contents${path}`;

        try {
            const response = await fetch(url, {
                headers: {
                    Authorization: `token ${this.token}`
                }
            });

            const data = await response.json();
            return data;
        } catch (error) {
            console.error(error);
            return null;
        }
    }


    async createFile() {
        const dir = await AsyncStorage.getItem('PATH');
        const filename = await AsyncStorage.getItem('FILENAME');
        const fileContent = await AsyncStorage.getItem('FILECONTENT');
        if (!dir || !filename || !fileContent) return;

        const path = dir + '/' + filename;
        const content = Buffer.from(fileContent).toString("base64");

        try {
            const response = await fetch(`https://api.github.com/repos/${this.owner}/${this.repo}/contents${path}`, {
                method: "PUT",
                headers: {
                    Authorization: `token ${this.token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    message: "Create new file",
                    content: content,
                }),
            });

            if (response.ok) {
                const data = await response.json();
                console.log("New file created:", data);
            } else {
                console.error("Error creating file:", response.status, response.statusText);
            }
        } catch (error) {
            console.error("Error creating file:", error);
        }
    }

    async updateFileContent(path: string, content: string, sha: string) {
        const url = `${this.BASE_URL}/repos/${this.owner}/${this.repo}/contents${path}`;
        const username = await this.getUsername();
        const token = this.token;
        const branch = 'main'; // 修改文件的分支

        try {
            // 构建提交数据
            const data = JSON.stringify({
                message: 'update file',
                content: content,
                sha: sha,
                branch: branch,
                committer: {
                    name: username,
                    email: `${username}@users.noreply.github.com`
                }
            });

            // 发送 PUT 请求
            const response = await fetch(url, {
                method: 'PUT',
                headers: {
                    Authorization: `token ${token}`,
                    'Content-Type': 'application/json'
                },
                body: data
            });

            const responseData = await response.json();
            return responseData;
        } catch (error) {
            console.error(error);
            return null;
        }
    }
}
