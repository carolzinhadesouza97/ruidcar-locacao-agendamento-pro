
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Check, X } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";

interface PendingWorkshop {
  id: string;
  name: string;
  address: string;
  contact: string;
  registrationDate: string;
  region: string;
}

interface PendingWorkshopsTableProps {
  workshops: PendingWorkshop[];
  approveWorkshop: (id: string) => void;
  rejectWorkshop: (id: string) => void;
  filter: { region: string; date: string };
  setFilter: (filter: { region: string; date: string }) => void;
}

export const PendingWorkshopsTable = ({
  workshops,
  approveWorkshop,
  rejectWorkshop,
  filter,
  setFilter,
}: PendingWorkshopsTableProps) => {
  return (
    <Card className="col-span-2">
      <CardHeader className="flex flex-row justify-between items-center">
        <CardTitle>Oficinas Pendentes de Aprovação</CardTitle>
        
        <div className="flex items-center gap-2">
          <Select
            value={filter.region}
            onValueChange={(value) => setFilter({ ...filter, region: value })}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filtrar por região" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas as regiões</SelectItem>
              <SelectItem value="norte">Norte</SelectItem>
              <SelectItem value="nordeste">Nordeste</SelectItem>
              <SelectItem value="centro-oeste">Centro-Oeste</SelectItem>
              <SelectItem value="sudeste">Sudeste</SelectItem>
              <SelectItem value="sul">Sul</SelectItem>
            </SelectContent>
          </Select>
          
          <Input
            type="date"
            value={filter.date}
            onChange={(e) => setFilter({ ...filter, date: e.target.value })}
            className="w-[180px]"
          />
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead className="hidden md:table-cell">Endereço</TableHead>
                <TableHead>Contato</TableHead>
                <TableHead className="hidden sm:table-cell">Data de Cadastro</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {workshops.length > 0 ? (
                workshops.map((workshop) => (
                  <TableRow key={workshop.id}>
                    <TableCell className="font-medium">{workshop.name}</TableCell>
                    <TableCell className="hidden md:table-cell">{workshop.address}</TableCell>
                    <TableCell>{workshop.contact}</TableCell>
                    <TableCell className="hidden sm:table-cell">
                      {new Date(workshop.registrationDate).toLocaleDateString('pt-BR')}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => approveWorkshop(workshop.id)}
                          className="h-8 text-green-600 border-green-600 hover:bg-green-50"
                        >
                          <Check className="h-4 w-4 mr-1" /> Aprovar
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => rejectWorkshop(workshop.id)}
                          className="h-8 text-red-600 border-red-600 hover:bg-red-50"
                        >
                          <X className="h-4 w-4 mr-1" /> Rejeitar
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-6 text-muted-foreground">
                    Nenhuma oficina pendente de aprovação encontrada.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default PendingWorkshopsTable;
