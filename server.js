const express = require('express');
const fs = require('fs');
const path = require('path');
const React = require('react');
const ReactDOMServer = require('react-dom/server');

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname));

app.post('/auth', (req, res) =>{
    const username = req.body.username;
    const notes = req.body.notes;
    
    if (notes){
        fs.appendFileSync('comments.txt', `${username}: ${notes}\n`);
    }
    res.redirect('/admin');
});

app.get('/admin', (req, res) =>{
    const currentHour = new Date().getHours();
    const isNight = currentHour < 6 || currentHour > 20;
    const bgColor = isNight ? '#34495e' : '#ffffff';
    const textColor = isNight ? 'white' : 'black';

    let comments = [];
    if (fs.existsSync('comments.txt')){
        const fileData = fs.readFileSync('comments.txt', 'utf8');
        comments = fileData.split('\n').filter(line => line.trim() !== '');
    }

    const AdminSsrComponent = React.createElement('div', {style:{background: bgColor, color: textColor, padding: '15px', borderRadius: '5px', marginBottom: '20px'}},
        React.createElement('h3', null, 'Server-Side React Component'),
        React.createElement('p', null, `Server Time: ${new Date().toLocaleTimeString()} (Theme changes dynamically)`),
        React.createElement('h4', null, 'User Notes from comments.txt:'),
        React.createElement('ul', null, comments.length > 0 
            ? comments.map((c, i) => React.createElement('li', {key: i}, c))
            : React.createElement('li', null, 'No comments yet.')
        )
    );

    const ssrHtml = ReactDOMServer.renderToString(AdminSsrComponent);

    let htmlTemplate = fs.readFileSync(path.join(__dirname, 'admin.html'), 'utf8');
    htmlTemplate = htmlTemplate.replace('<div id="ssr-admin-container"></div>', ssrHtml);
    
    res.send(htmlTemplate);
});

app.get('/', (req, res) =>{

    const HomeSsrComponent = React.createElement('div', {style:{background: '#ffffff', padding: '10px', borderLeft: '4px solid #f0932b'}},
        React.createElement('h3', null, 'Server Notice'),
        React.createElement('p', null, 'This page was pre-rendered by React on the Node.js server!')
    );

    const ssrHtml = ReactDOMServer.renderToString(HomeSsrComponent);
    let htmlTemplate = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf8');
    htmlTemplate = htmlTemplate.replace('<div id="ssr-home-container"></div>', ssrHtml);
    
    res.send(htmlTemplate);
});


app.get('/', (req, res) =>{

    const HomeSsrComponent = React.createElement('div', {style:{background: '#ffffff', padding: '10px', borderLeft: '4px solid #f0932b'}},
        React.createElement('h3', null, 'Server Notice'),
        React.createElement('p', null, 'This page was pre-rendered by React on the Node.js server!')
    );

    const ssrHtml = ReactDOMServer.renderToString(HomeSsrComponent);
    let htmlTemplate = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf8');
    htmlTemplate = htmlTemplate.replace('<div id="ssr-home-container"></div>', ssrHtml);
    
    res.send(htmlTemplate);
});


app.get('/api/comments', (req, res) =>{
    let comments = [];
    if (fs.existsSync('comments.txt')){
        const fileData = fs.readFileSync('comments.txt', 'utf8');
        comments = fileData.split('\n').filter(line => line.trim() !== '');
    }
    res.json({status: 'success', data: comments});
});

app.get('/api/stats', (req, res) =>{
    res.json({activeUsers: 5, citiesInDatabase: 3, serverStatus: "Running"});
});

app.get('/api/time', (req, res) =>{
    res.send(`<span style="color: blue;">Server time is: ${new Date().toLocaleTimeString()}</span>`);
});

app.listen(3000, () =>{
    console.log('Server is running! Open http://localhost:3000 in your browser.');
});