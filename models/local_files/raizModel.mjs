import raizMessage from '../../users/raizMessage.json' with { type: 'json' };

export class wellcomeModel{
 static async wellcome () {
  return raizMessage
 }
}