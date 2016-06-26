# Livebase
Chat bot for Angular with MySQL. Designed so that developer could focus on UI and personalization of the chat bot.
## Installation
#### 1. Install from bower 

```
bower install livebase-mysql
```

#### 2. Include Livebase module and configure your settings

```javascript
angular.module('App', ['livebase'])

  .config(function($livebaseProvider){
  
    $livebaseProvider.url(SERVER_URL);
    
    $livebaseProvider.tell([
    
      { cmd:"Hello", reply:"Hello, may I know your name?" }
      
    ]);
```

#### 3. Include livebase and its dependencies

```html
<!-- AngularJS -->
<script src="https://ajax.googleapis.com/ajax/libs/angularjs/1.5.0/angular.min.js"></script>
<!-- Livebase -->
<script src="bower_components/livebase/livebase.min.js"></script>
```

## Usage

```html
<livebase>
    <ul>
        <li ng-repeat="chat in chats">
            {{chat.type}} - {{chat.text}}
        </li>
    </ul>
    <lb-listen>Speak</lb-listen>
    <lb-input></lb-input>
    <lb-send>Send</lb-send>
</livebase>
```

## Demo
[Livebase](https://livebase.firebaseapp.com/)

## Credits
##### Dr Goh Ong Sing
##### Ku Ahmad Mudrikah
