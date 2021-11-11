require('dotenv').config();
const agent = require('superagent');
const { StatusCodes } = require('http-status-codes');
const { expect } = require('chai');

const urlBase = 'https://api.github.com';
// eslint-disable-next-line no-multi-str
const gistContent = 'let miPrimeraPromise = new Promise((resolve, reject) => {\n\
                        // Llamamos a resolve(...) cuando lo que estabamos haciendo finaliza con éxito, y reject(...) cuando falla.\n\
                        // En este ejemplo, usamos setTimeout(...) para simular código asíncrono.\n\
                        // En la vida real, probablemente uses algo como XHR o una API HTML5.\n\
                        setTimeout(function(){\n\
                          resolve("¡Éxito!"); // ¡Todo salió bien!\n\
                        }, 250);\n\
                      });\n\
                      miPrimeraPromise.then((successMessage) => {\n\
                        // succesMessage es lo que sea que pasamos en la función resolve(...) de arriba.\n\
                        // No tiene por qué ser un string, pero si solo es un mensaje de éxito, probablemente lo sea.\n\
                        console.log("¡Sí! " + successMessage);\n\
                      });';

describe('Github Api Gist test', () => {
  describe('From logged in user', () => {
    let gistUrl;
    it('should create a gist', async () => {
      const response = await agent
        .post(`${urlBase}/gists`)
        .auth('token', process.env.ACCESS_TOKEN)
        .set('User-Agent', 'SRendonn')
        .send({
          files: {
            'promiseExample.js': {
              content: gistContent
            }
          }
        });
      gistUrl = response.body.url;
      expect(response.status).to.equal(StatusCodes.CREATED);
    });
    describe('Verifies that the gist was created', () => {
      it('should check via the gist URL that the gist exists', async () => {
        const gistRes = await agent
          .get(gistUrl)
          .auth('token', process.env.ACCESS_TOKEN)
          .set('User-Agent', 'SRendonn');

        expect(gistRes.status).to.equal(StatusCodes.OK);
      });
    });

    describe('Deletes the gist', () => {
      it('should delete the gist', async () => {
        const gistRes = await agent
          .delete(gistUrl)
          .auth('token', process.env.ACCESS_TOKEN)
          .set('User-Agent', 'SRendonn');

        expect(gistRes.status).to.equal(StatusCodes.NO_CONTENT);
      });
    });

    describe('Verifies that the gist no longer exist', () => {
      it('should check via the gist URL that the gist does not exist', async () => {
        try {
          await agent
            .get(gistUrl)
            .auth('token', process.env.ACCESS_TOKEN)
            .set('User-Agent', 'SRendonn');
        } catch (error) {
          expect(error.response.status).to.equal(404);
        }
      });
    });
  });
});
