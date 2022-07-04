import React from 'react';
import axios from 'axios';
import './style.css';

class GitApp extends React.Component {
  constructor() {
    super();
    this.state = {
      username: '',
      fork: false,
      filteredData: [],
      responseData: [],
      noData: false,
    };
  }
  callAPI = (e) => {
    e.preventDefault();
    const url =
      'https://api.github.com/users/' + this.state.username + '/repos';
    axios
      .get(url)
      .then((response) => {
        if (response.status === 200) {
          if (response.data.length) {
            this.setState({
              noData: false,
              responseData: response.data,
              filteredData: response.data,
            });
          } else {
            this.setState({
              noData: true,
            });
          }
        }
      })
      .catch(() => {
        this.setState({
          noData: true,
        });
      });
  };
  filterResult = () => {
    if (this.state.fork) {
      const newRecord = this.state.responseData.filter((ele) => ele.fork);
      this.setState({
        filteredData: newRecord,
      });
    } else {
      this.setState({
        filteredData: this.state.responseData,
      });
    }
  };
  render() {
    const { username, fork, filteredData, noData } = this.state;
    return (
      <React.Fragment>
        <form onSubmit={this.callAPI}>
          <label>Github user name: </label>
          <input
            required
            value={username}
            onChange={(e) => {
              this.setState({ username: e.target.value });
            }}
          />
          <label> Include forks: </label>
          <input
            type="checkbox"
            value={fork}
            onChange={(e) => {
              this.setState({ fork: !fork }, () => {
                this.filterResult();
              });
            }}
          />
          <button type="submit">Submit</button>
        </form>
        {!noData ? (
          <table>
            <thead class="tableHead">
              <th>Name</th>
              <th>Language</th>
              <th>Description</th>
              <th>Size</th>
            </thead>
            <tbody>
              {filteredData.map((ele, key) => {
                return (
                  <tr key={key}>
                    <td>{ele.name}</td>
                    <td>{ele.language}</td>
                    <td>{ele.description}</td>
                    <td>{ele.size}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        ) : (
          <p>No data found</p>
        )}
      </React.Fragment>
    );
  }
}

export default function App() {
  return <GitApp />;
}
