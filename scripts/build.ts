import {getBuiltPageContent} from './getBuiltPageContent.js';
import {logSuccessfulMessage} from './logSuccessfulMessage.js';
import {writeBuiltPage} from './writeBuiltPage.js';

declare const process: {env: {_START: string}};

const startTestsTime = Date.now();

logSuccessfulMessage(
  `Prettified and compiled in ${startTestsTime - Number(process.env._START)}ms!`,
);

const builtPageContent = getBuiltPageContent();

writeBuiltPage(builtPageContent);

logSuccessfulMessage(`Built in ${Date.now() - startTestsTime}ms!`);
