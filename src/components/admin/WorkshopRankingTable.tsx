
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Star } from "lucide-react";

interface TopWorkshop {
  id: string;
  name: string;
  region: string;
  totalAppointments: number;
  revenue: number;
  rating: number;
}

interface WorkshopRankingTableProps {
  workshops: TopWorkshop[];
  sortBy: string;
  setSortBy: (sortBy: string) => void;
}

export const WorkshopRankingTable = ({
  workshops,
  sortBy,
  setSortBy,
}: WorkshopRankingTableProps) => {
  return (
    <Card className="col-span-2">
      <CardHeader className="flex flex-row justify-between items-center">
        <CardTitle>Ranking de Oficinas</CardTitle>
        
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground whitespace-nowrap">Ordenar por:</span>
          <Select
            value={sortBy}
            onValueChange={(value) => setSortBy(value)}
          >
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Ordenar por" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="appointments">Total de Agendamentos</SelectItem>
              <SelectItem value="revenue">Faturamento</SelectItem>
              <SelectItem value="rating">Avaliação</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Posição</TableHead>
                <TableHead>Nome</TableHead>
                <TableHead className="hidden md:table-cell">Região</TableHead>
                <TableHead className="hidden sm:table-cell">Agendamentos</TableHead>
                <TableHead>Faturamento</TableHead>
                <TableHead>Avaliação</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {workshops.map((workshop, index) => (
                <TableRow key={workshop.id}>
                  <TableCell className="font-medium">{index + 1}</TableCell>
                  <TableCell>{workshop.name}</TableCell>
                  <TableCell className="hidden md:table-cell">{workshop.region}</TableCell>
                  <TableCell className="hidden sm:table-cell">{workshop.totalAppointments}</TableCell>
                  <TableCell>R$ {workshop.revenue.toLocaleString('pt-BR')}</TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <span>{workshop.rating.toFixed(1)}</span>
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 ml-1" />
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default WorkshopRankingTable;
