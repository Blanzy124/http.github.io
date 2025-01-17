import raizMessage from '../../users/raizMessage.json'  assert { type: 'json' };

export class wellcomeModel{
 static async wellcome () {
  return raizMessage
 }
}