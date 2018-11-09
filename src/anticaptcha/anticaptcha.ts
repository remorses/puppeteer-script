var Anticaptcha = function(clientKey): any {
  return new function(clientKey: any): void {
    (<any>this).params = {
      host: 'api.anti-captcha.com',
      port: 80,
      clientKey: clientKey,

      // reCAPTCHA 2
      websiteUrl: null,
      websiteKey: null,
      websiteSToken: null,
      proxyType: 'http',
      proxyAddress: null,
      proxyPort: null,
      proxyLogin: null,
      proxyPassword: null,
      userAgent: '',
      cookies: '',

      // FunCaptcha
      websitePublicKey: null,

      // image
      phrase: null,
      case: null,
      numeric: null,
      math: null,
      minLength: null,
      maxLength: null,

      // CustomCaptcha
      imageUrl: null,
      assignment: null,
      forms: null,

      softId: null,
      languagePool: null
    };

    var connectionTimeout = 20,
      firstAttemptWaitingInterval = 5,
      normalWaitingInterval = 2;

    (<any>this).getBalance = function(cb) {
      var postData = {
        clientKey: (<any>this).params.clientKey
      };

      (<any>this).jsonPostRequest('getBalance', postData, function(err, jsonResult) {
        if (err) {
          return cb(err, null, jsonResult);
        }

        cb(null, jsonResult.balance, jsonResult);
      });
    };

    (<any>this).createTask = function(cb, type, taskData) {
      type = typeof type == 'undefined' ? 'NoCaptchaTask' : type;
      var taskPostData = (<any>this).getPostData(type);
      taskPostData.type = type;

      // Merge incoming and already fetched taskData, incoming data has priority
      if (typeof taskData == 'object') {
        for (var i in taskData) {
          taskPostData[i] = taskData[i];
        }
      }

      var postData = {
        clientKey: (<any>this).params.clientKey,
        task: taskPostData,
        softId: (<any>this).params.softId !== null ? (<any>this).params.softId : 0
      };

      if ((<any>this).params.languagePool !== null) {
        postData.languagePool = (<any>this).params.languagePool;
      }

      (<any>this).jsonPostRequest('createTask', postData, function(err, jsonResult) {
        if (err) {
          return cb(err, null, jsonResult);
        }

        // Task created
        var taskId = jsonResult.taskId;

        cb(null, taskId, jsonResult);
      });
    };

    (<any>this).createTaskProxyless = function(cb) {
      (<any>this).createTask(cb, 'NoCaptchaTaskProxyless');
    };

    (<any>this).createFunCaptchaTask = function(cb) {
      (<any>this).createTask(cb, 'FunCaptchaTask');
    };

    (<any>this).createFunCaptchaTaskProxyless = function(cb) {
      (<any>this).createTask(cb, 'FunCaptchaTaskProxyless');
    };

    (<any>this).createImageToTextTask = function(taskData, cb) {
      (<any>this).createTask(cb, 'ImageToTextTask', taskData);
    };

    (<any>this).createCustomCaptchaTask = function(cb) {
      (<any>this).createTask(cb, 'CustomCaptchaTask');
    };

    (<any>this).getTaskRawResult = function(jsonResult) {
      if (typeof jsonResult.solution.gRecaptchaResponse != 'undefined') {
        return jsonResult.solution.gRecaptchaResponse;
      } else if (typeof jsonResult.solution.token != 'undefined') {
        return jsonResult.solution.token;
      } else if (typeof jsonResult.solution.answers != 'undefined') {
        return jsonResult.solution.answers;
      } else {
        return jsonResult.solution.text;
      }
    }

    (<any>this).getTaskSolution = function(taskId, cb, currentAttempt, tickCb) {
      currentAttempt = currentAttempt || 0;

      var postData = {
        clientKey: (<any>this).params.clientKey,
        taskId: taskId
      };

      var waitingInterval;
      if (currentAttempt == 0) {
        waitingInterval = firstAttemptWaitingInterval;
      } else {
        waitingInterval = normalWaitingInterval;
      }

      console.log('Waiting %s seconds', waitingInterval);

      var that = (<any>this);

      setTimeout(function() {
        that.jsonPostRequest('getTaskResult', postData, function(err, jsonResult) {
          if (err) {
            return cb(err, null, jsonResult);
          }

          if (jsonResult.status == 'processing') {
            // Every call I'm ticki-ing
            if (tickCb) {
              tickCb();
            }
            return that.getTaskSolution(taskId, cb, currentAttempt + 1, tickCb);
          } else if (jsonResult.status == 'ready') {
            return cb(
              null,
              that.getTaskRawResult(jsonResult),
              jsonResult
            );
          }
        });
      }, waitingInterval * 1000);
    };

    (<any>this).getPostData = function(type) {
      switch (type) {
        case 'CustomCaptchaTask':
          return {
            imageUrl: (<any>this).params.imageUrl,
            assignment: (<any>this).params.assignment,
            forms: (<any>this).params.forms
          };
        case 'ImageToTextTask':
          return {
            phrase: (<any>this).params.phrase,
            case: (<any>this).params.case,
            numeric: (<any>this).params.numeric,
            math: (<any>this).params.math,
            minLength: (<any>this).params.minLength,
            maxLength: (<any>this).params.maxLength
          };
          break;
        case 'NoCaptchaTaskProxyless':
          return {
            websiteURL: (<any>this).params.websiteUrl,
            websiteKey: (<any>this).params.websiteKey,
            websiteSToken: (<any>this).params.websiteSToken
          };
          break;
        case 'FunCaptchaTask':
          return {
            websiteURL: (<any>this).params.websiteUrl,
            websitePublicKey: (<any>this).params.websitePublicKey,
            proxyType: (<any>this).params.proxyType,
            proxyAddress: (<any>this).params.proxyAddress,
            proxyPort: (<any>this).params.proxyPort,
            proxyLogin: (<any>this).params.proxyLogin,
            proxyPassword: (<any>this).params.proxyPassword,
            userAgent: (<any>this).params.userAgent,
            cookies: (<any>this).params.cookies
          };
          break;
        case 'FunCaptchaTaskProxyless':
          return {
            websiteURL: (<any>this).params.websiteUrl,
            websitePublicKey: (<any>this).params.websitePublicKey,
          }
        default: // NoCaptchaTask
          return {
            websiteURL: (<any>this).params.websiteUrl,
            websiteKey: (<any>this).params.websiteKey,
            websiteSToken: (<any>this).params.websiteSToken,
            proxyType: (<any>this).params.proxyType,
            proxyAddress: (<any>this).params.proxyAddress,
            proxyPort: (<any>this).params.proxyPort,
            proxyLogin: (<any>this).params.proxyLogin,
            proxyPassword: (<any>this).params.proxyPassword,
            userAgent: (<any>this).params.userAgent,
            cookies: (<any>this).params.cookies
          };
      }


    };

    (<any>this).jsonPostRequest = function(methodName, postData, cb) {
      if (typeof process === 'object' && typeof require === 'function') { // NodeJS
        var http = require('http');

        // http request options
        var options = {
          hostname: (<any>this).params.host,
          port: (<any>this).params.port,
          path: '/' + methodName,
          method: 'POST',
          headers: {
            'accept-encoding': 'gzip,deflate',
            'content-type': 'application/json; charset=utf-8',
            'accept': 'application/json',
            'content-length': Buffer.byteLength(JSON.stringify(postData))
          }
        };

        // console.log(options);
        // console.log(JSON.stringify(postData));

        var req = http.request(options, function(response) { // on response
          var str = '';

          // another chunk of data has been recieved, so append it to `str`
          response.on('data', function(chunk) {
            str += chunk;
          });

          // the whole response has been recieved, so we just print it out here
          response.on('end', function() {
            // console.log(str);

            try {
              var jsonResult = JSON.parse(str);
            } catch (err) {
              return cb(err);
            }

            if (jsonResult.errorId) {
              return cb(new Error(jsonResult.errorDescription, jsonResult.errorCode), jsonResult);
            }

            return cb(null, jsonResult);
          });
        });

        // send post data
        req.write(JSON.stringify(postData));
        req.end();

        // timeout in milliseconds
        req.setTimeout(connectionTimeout * 1000);
        req.on('timeout', function() {
          console.log('timeout');
          req.abort();
        });

        // After timeout connection throws Error, so we have to handle it
        req.on('error', function(err) {
          console.log('error');
          return cb(err);
        });

        return req;
      } else if ((typeof window !== 'undefined' || typeof chrome === 'object') && typeof $ == 'function') { // in browser or chrome extension with jQuery
        $.ajax(
          (window.location.protocol == 'https:' ? 'https:' : 'http:') + '//'
          + (<any>this).params.host
          + (window.location.protocol != 'https:' ? ':' + (<any>this).params.port : '')
          + '/' + methodName,
          {
            method: 'POST',
            data: JSON.stringify(postData),
            dataType: 'json',
            success: function(jsonResult) {
              if (jsonResult && jsonResult.errorId) {
                return cb(new Error(jsonResult.errorDescription, jsonResult.errorCode), jsonResult);
              }

              cb(false, jsonResult);
            },
            error: function(jqXHR, textStatus, errorThrown) {
              cb(new Error(textStatus != 'error' ? textStatus : 'Unknown error, watch console')); // should be errorThrown
            }
          }
        );
      } else {
        console.error('Application should be run either in NodeJs environment or has jQuery to be included');
      }
    };

    (<any>this).setClientKey = function(value) {
      (<any>this).params.clientKey = value;
    };

    //proxy access parameters
    (<any>this).setWebsiteURL = function(value) {
      (<any>this).params.websiteUrl = value;
    };

    (<any>this).setWebsiteKey = function(value) {
      (<any>this).params.websiteKey = value;
    };

    (<any>this).setWebsiteSToken = function(value) {
      (<any>this).params.websiteSToken = value;
    };

    (<any>this).setWebsitePublicKey = function(value) {
      (<any>this).params.websitePublicKey = value;
    };

    (<any>this).setProxyType = function(value) {
      (<any>this).params.proxyType = value;
    };

    (<any>this).setProxyAddress = function(value) {
      (<any>this).params.proxyAddress = value;
    };

    (<any>this).setProxyPort = function(value) {
      (<any>this).params.proxyPort = value;
    };

    (<any>this).setProxyLogin = function(value) {
      (<any>this).params.proxyLogin = value;
    };

    (<any>this).setProxyPassword = function(value) {
      (<any>this).params.proxyPassword = value;
    };

    (<any>this).setUserAgent = function(value) {
      (<any>this).params.userAgent = value;
    };

    (<any>this).setCookies = function(value) {
      (<any>this).params.cookies = value;
    };

    // image
    (<any>this).setPhrase = function(value) {
      (<any>this).params.phrase = value;
    };

    (<any>this).setCase = function(value) {
      (<any>this).params.case = value;
    };

    (<any>this).setNumeric = function(value) {
      (<any>this).params.numeric = value;
    };

    (<any>this).setMath = function(value) {
      (<any>this).params.math = value;
    };

    (<any>this).setMinLength = function(value) {
      (<any>this).params.minLength = value;
    };

    (<any>this).setMaxLength = function(value) {
      (<any>this).params.maxLength = value;
    };

    (<any>this).setImageUrl = function(value) {
      (<any>this).params.imageUrl = value;
    };

    (<any>this).setAssignment = function(value) {
      (<any>this).params.assignment = value;
    };

    (<any>this).setForms = function(value) {
      (<any>this).params.forms = value;
    };

    (<any>this).setSoftId = function(value) {
      (<any>this).params.softId = value;
    };

    (<any>this).setLanguagePool = function(value) {
      (<any>this).params.languagePool = value;
    };

    (<any>this).setHost = function(value) {
      (<any>this).params.host = value;
    };

    (<any>this).setPort = function(value) {
      (<any>this).params.port = value;
    };

  }(clientKey);
};

if (typeof process === 'object' && typeof require === 'function') { // NodeJS
  module.exports = Anticaptcha;
}
