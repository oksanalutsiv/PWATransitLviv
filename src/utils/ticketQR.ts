/** Encodes ticket data into a QR payload string */
export const encodeTicketQR = (ticketId: string, userId: string, validUntil: string): string => {
  return btoa(JSON.stringify({ ticketId, userId, validUntil, ts: Date.now() }))
}

/** Decodes a QR payload string back to ticket data */
export const decodeTicketQR = (payload: string) => {
  try {
    return JSON.parse(atob(payload)) as { ticketId: string; userId: string; validUntil: string; ts: number }
  } catch {
    return null
  }
}
