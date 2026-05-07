import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { Logger } from '@nestjs/common';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class SubmissionsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  handleConnection(client: any) {}
  handleDisconnect(client: any) {}

  private updateBuffer: any[] = [];
  private flushInterval: NodeJS.Timeout | null = null;

  emitSubmissionUpdate(submission: any) {
    // Thêm vào buffer
    this.updateBuffer.push(submission);

    // Nếu chưa có interval, bắt đầu đếm ngược để gửi
    if (!this.flushInterval) {
      this.flushInterval = setInterval(() => {
        if (this.updateBuffer.length > 0) {
          // Gửi toàn bộ danh sách đã gom được
          this.server.emit('submissionsBatchUpdate', this.updateBuffer);
          this.updateBuffer = []; // Xóa sạch buffer sau khi gửi
        }
      }, 500); // Gửi mỗi 500ms
    }
  }
}
