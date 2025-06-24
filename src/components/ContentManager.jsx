
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { ArrowLeft, Plus, Edit, Trash2, BookOpen, Search } from 'lucide-react';

const ContentManager = ({ user, onNavigate }) => {
  const [content, setContent] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    term: '',
    definition: ''
  });
  const { toast } = useToast();

  useEffect(() => {
    loadContent();
  }, [user.id]);

  const loadContent = () => {
    const allContent = JSON.parse(localStorage.getItem('content') || '[]');
    const userContent = allContent.filter(c => c.userId === user.id);
    setContent(userContent);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.term.trim() || !formData.definition.trim()) {
      toast({
        title: "Erro",
        description: "Preencha todos os campos",
        variant: "destructive",
      });
      return;
    }

    const allContent = JSON.parse(localStorage.getItem('content') || '[]');
    
    if (isEditing) {
      const updatedContent = allContent.map(c => 
        c.id === editingId 
          ? { ...c, term: formData.term, definition: formData.definition, updatedAt: new Date().toISOString() }
          : c
      );
      localStorage.setItem('content', JSON.stringify(updatedContent));
      
      toast({
        title: "Sucesso!",
        description: "Conteúdo atualizado com sucesso",
      });
    } else {
      const newContent = {
        id: Date.now(),
        userId: user.id,
        term: formData.term,
        definition: formData.definition,
        createdAt: new Date().toISOString()
      };
      
      allContent.push(newContent);
      localStorage.setItem('content', JSON.stringify(allContent));
      
      toast({
        title: "Sucesso!",
        description: "Conteúdo adicionado com sucesso",
      });
    }

    setFormData({ term: '', definition: '' });
    setIsEditing(false);
    setEditingId(null);
    loadContent();
  };

  const handleEdit = (item) => {
    setFormData({ term: item.term, definition: item.definition });
    setIsEditing(true);
    setEditingId(item.id);
  };

  const handleDelete = (id) => {
    const allContent = JSON.parse(localStorage.getItem('content') || '[]');
    const updatedContent = allContent.filter(c => c.id !== id);
    localStorage.setItem('content', JSON.stringify(updatedContent));
    
    toast({
      title: "Sucesso!",
      description: "Conteúdo removido com sucesso",
    });
    
    loadContent();
  };

  const filteredContent = content.filter(item =>
    item.term.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.definition.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen p-6">
      <div className="flex items-center gap-4 mb-8">
        <Button
          onClick={() => onNavigate('dashboard')}
          variant="outline"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Voltar
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Gerenciar Conteúdo</h1>
          <p className="text-gray-600">Cadastre termos e definições para seus jogos</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <Card className="bg-white shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="w-5 h-5" />
                {isEditing ? 'Editar Conteúdo' : 'Adicionar Conteúdo'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="term">Termo</Label>
                  <Input
                    id="term"
                    placeholder="Digite o termo..."
                    value={formData.term}
                    onChange={(e) => setFormData({...formData, term: e.target.value})}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="definition">Definição</Label>
                  <Textarea
                    id="definition"
                    placeholder="Digite a definição..."
                    value={formData.definition}
                    onChange={(e) => setFormData({...formData, definition: e.target.value})}
                    className="min-h-[100px]"
                  />
                </div>
                
                <div className="flex gap-2">
                  <Button
                    type="submit"
                    className="flex-1 bg-blue-600 text-white hover:bg-blue-700"
                  >
                    {isEditing ? 'Atualizar' : 'Adicionar'}
                  </Button>
                  
                  {isEditing && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setIsEditing(false);
                        setEditingId(null);
                        setFormData({ term: '', definition: '' });
                      }}
                    >
                      Cancelar
                    </Button>
                  )}
                </div>
              </form>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-2">
          <Card className="bg-white shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="w-5 h-5" />
                Conteúdos Cadastrados ({content.length})
              </CardTitle>
              <div className="relative mt-2">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Buscar conteúdo..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 max-h-[600px] overflow-y-auto">
                {filteredContent.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <BookOpen className="w-12 h-12 mx-auto mb-4" />
                    <p>
                      {searchTerm ? 'Nenhum conteúdo encontrado' : 'Nenhum conteúdo cadastrado ainda'}
                    </p>
                  </div>
                ) : (
                  filteredContent.map((item) => (
                    <div
                      key={item.id}
                      className="border rounded-lg p-4"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-semibold text-lg">{item.term}</h3>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleEdit(item)}
                          >
                            <Edit className="w-3 h-3" />
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleDelete(item.id)}
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                      <p className="text-gray-600">{item.definition}</p>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ContentManager;
