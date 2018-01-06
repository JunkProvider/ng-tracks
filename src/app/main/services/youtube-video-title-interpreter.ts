import { Injectable } from '@angular/core';

export interface YoutubeVideoTitleInterpreterResult {
  title: string;
  interprets: string[];
}

@Injectable()
export class YoutubeVideoTitleInterpreter {
  interpret(text: string): YoutubeVideoTitleInterpreterResult {
    const parts = text.split('-')
      .map(part => part.trim())
      .filter(part => part.length > 0 && isNaN(parseInt(part, 10)));

    const result: YoutubeVideoTitleInterpreterResult = {
      title: null,
      interprets: null
    };

    if (parts.length > 0) {
      result.interprets = [ parts[0] ];
    }

    if (parts.length > 1) {
      result.title = parts[1];
    }

    return result;
  }
}
