'use strict';
const Generator = require('yeoman-generator');
const chalk = require('chalk');
const yosay = require('yosay');
const path = require('path');
const _ = require('lodash');
const extend = require('deep-extend');
const mkdirp = require('mkdirp');

module.exports = class extends Generator {
  prompting() {
    // Have Yeoman greet the user.
    this.log(
      yosay(`Welcome to the badass ${chalk.red('generator-botbuilder-java')} generator!`)
    );

    const prompts = [
      { name: 'botName', message: `What 's the name of your bot?`, default: 'sample' },
      { name: 'description', message: 'What will your bot do?', default: 'sample' },
      { name: 'dialog', type: 'list', message: 'What default dialog do you want?', choices: ['Echo'] },
    ];

    return this.prompt(prompts).then(props => {
      // To access props later use this.props.someAnswer;
      this.props = props;
    });
  }

  writing() {
    const directoryName = _.kebabCase(this.props.botName);
    const botName = this.props.botName;

    if (path.basename(this.destinationPath()) !== directoryName) {
      this.log(`Your bot should be in a directory named ${directoryName}\nI'll automatically create this folder.`);
      mkdirp(directoryName);
      this.destinationRoot(this.destinationPath(directoryName));
    }

    this.fs.copyTpl(this.templatePath('pom.xml'), this.destinationPath('pom.xml'), { botName: directoryName });
    this.fs.copy(this.templatePath(`app.java`), this.destinationPath(`app.java`));
    this.fs.copy(this.templatePath(`botName.bot`), this.destinationPath(`${this.props.botName}.bot`), {
      process: function(content) {
        var pattern = new RegExp('<%= botName %>','g');
        return content.toString().replace(pattern, botName.toString()); 
    }});
    this.fs.copyTpl(this.templatePath('README.md'), this.destinationPath('README.md'), {
      botName: this.props.botName, description: this.props.description
    });
  }

  install() {
    this.installDependencies({bower: false});
  }
};
