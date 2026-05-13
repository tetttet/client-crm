import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Chip from "@mui/material/Chip";
import Typography from "@mui/material/Typography";

type DashboardNote = {
  id: number;
  author: string;
  avatar: string;
  createdAt: string;
  excerpt: string;
  tag: string;
  accent: string;
};

const notes: ReadonlyArray<DashboardNote> = [
  {
    id: 1,
    author: "Ariana Kim",
    avatar: "AK",
    createdAt: "Today, 09:20",
    excerpt:
      "Попросила обновить коммерческое предложение для клиента Northwind и отправить финальную версию до конца дня.",
    tag: "Client",
    accent: "#1b75d2",
  },
  {
    id: 2,
    author: "Marcus Reed",
    avatar: "MR",
    createdAt: "Today, 11:05",
    excerpt:
      "Нужно сверить расходы по маркетингу с апрельским бюджетом и вынести расхождения в пятничный статус-митинг.",
    tag: "Finance",
    accent: "#10b981",
  },
  {
    id: 3,
    author: "Sophia Patel",
    avatar: "SP",
    createdAt: "Yesterday, 17:40",
    excerpt:
      "Клиент подтвердил продление контракта, но ждёт короткую дорожную карту по внедрению новых модулей CRM.",
    tag: "Follow-up",
    accent: "#f59e0b",
  },
];

export function DashboardTeamNotes() {
  return (
    <Card
      sx={{
        display: "flex",
        height: "100%",
        minHeight: 0,
        flexDirection: "column",
        border: 1,
        borderColor: "white",
        borderRadius: 0,
        gap: 2.5,
        px: { xs: 2.5, md: 3 },
        py: { xs: 2.5, md: 3 },
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          alignItems: "flex-start",
          justifyContent: "space-between",
          gap: 2,
        }}
      >
        <Box>
          <Typography color="text.secondary" variant="subtitle2">
            Внутренние заметки
          </Typography>

          <Typography sx={{ mt: 0.75, fontWeight: 600 }} variant="h5">
            Последние записи
          </Typography>

          <Typography color="text.secondary" sx={{ mt: 0.75 }} variant="body2">
            Кто оставил заметку и короткий фрагмент по текущим задачам
          </Typography>
        </Box>

        <Chip
          label={`${notes.length} notes`}
          size="small"
          sx={{
            borderRadius: 999,
            bgcolor: "rgba(27, 117, 210, 0.10)",
            color: "primary.main",
            fontWeight: 700,
          }}
        />
      </Box>

      <Box
        sx={{
          display: "grid",
          gap: 1.5,
          minHeight: 0,
          overflowY: "auto",
        }}
      >
        {notes.map((note) => (
          <Box
            key={note.id}
            sx={{
              border: 1,
              borderColor: "divider",
              bgcolor: "rgba(255,255,255,0.82)",
              px: 2,
              py: 1.75,
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "flex-start",
                justifyContent: "space-between",
                gap: 1.5,
              }}
            >
              <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1.5 }}>
                <Avatar
                  sx={{
                    bgcolor: note.accent,
                    fontSize: 13,
                    fontWeight: 700,
                    height: 38,
                    width: 38,
                  }}
                >
                  {note.avatar}
                </Avatar>

                <Box sx={{ minWidth: 0 }}>
                  <Typography sx={{ fontWeight: 700 }} variant="body2">
                    {note.author}
                  </Typography>

                  <Typography color="text.secondary" variant="caption">
                    {note.createdAt}
                  </Typography>
                </Box>
              </Box>

              <Chip
                label={note.tag}
                size="small"
                sx={{
                  borderRadius: 999,
                  bgcolor: `${note.accent}14`,
                  color: note.accent,
                  fontWeight: 700,
                }}
              />
            </Box>

            <Typography
              color="text.secondary"
              sx={{ mt: 1.5, lineHeight: 1.6 }}
              variant="body2"
            >
              {note.excerpt}
            </Typography>
          </Box>
        ))}
      </Box>
    </Card>
  );
}
