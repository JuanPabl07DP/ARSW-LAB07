package edu.eci.arsw.blueprints.persistence.impl;

import edu.eci.arsw.blueprints.model.Blueprint;
import edu.eci.arsw.blueprints.model.Point;
import edu.eci.arsw.blueprints.persistence.BlueprintNotFoundException;
import edu.eci.arsw.blueprints.persistence.BlueprintPersistenceException;
import edu.eci.arsw.blueprints.persistence.BlueprintsPersistence;
import org.springframework.stereotype.Repository;

import java.util.HashSet;
import java.util.Map;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;

@Repository
public class InMemoryBlueprintPersistence implements BlueprintsPersistence {

    private final ConcurrentHashMap<Tuple<String,String>,Blueprint> blueprints = new ConcurrentHashMap<>();

    public InMemoryBlueprintPersistence() {
        //load stub data
        // Plano 1 - Autor 1
        Point[] pts1 = new Point[]{
                new Point(140, 140),
                new Point(115, 115)
        };
        Blueprint bp1 = new Blueprint("juan", "house", pts1);
        blueprints.put(new Tuple<>(bp1.getAuthor(), bp1.getName()), bp1);

        // Plano 2 - Autor 1
        Point[] pts2 = new Point[]{
                new Point(240, 240),
                new Point(215, 215),
                new Point(230, 230)
        };
        Blueprint bp2 = new Blueprint("pablo", "school", pts2);
        blueprints.put(new Tuple<>(bp2.getAuthor(), bp2.getName()), bp2);

        // Plano 3 - Autor 2
        Point[] pts3 = new Point[]{
                new Point(340, 340),
                new Point(315, 315),
                new Point(330, 330),
                new Point(320, 320)
        };
        Blueprint bp3 = new Blueprint("nicolas", "office", pts3);
        blueprints.put(new Tuple<>(bp3.getAuthor(), bp3.getName()), bp3);

        // Plano 4 - Autor 3
        Point[] pts4 = new Point[]{
                new Point(440, 440),
                new Point(415, 415),
                new Point(430, 430),
                new Point(420, 420),
                new Point(425, 425)
        };
        Blueprint bp4 = new Blueprint("fabio", "mall", pts4);
        blueprints.put(new Tuple<>(bp4.getAuthor(), bp4.getName()), bp4);
    }

    @Override
    public void saveBlueprint(Blueprint bp) throws BlueprintPersistenceException {
        Blueprint prev = blueprints.putIfAbsent(new Tuple<>(bp.getAuthor(), bp.getName()), bp);
        if (prev != null) {
            throw new BlueprintPersistenceException("The given blueprint already exists: "+bp);
        }
    }

    @Override
    public Blueprint getBlueprint(String author, String bprintname) throws BlueprintNotFoundException {
        Blueprint bp = blueprints.get(new Tuple<>(author, bprintname));
        if (bp == null) {
            throw new BlueprintNotFoundException("Blueprint not found with author: " + author + " and name: " + bprintname);
        }
        return bp;
    }

    @Override
    public Set<Blueprint> getBlueprintsByAuthor(String author) throws BlueprintNotFoundException {
        Set<Blueprint> authorBlueprints = new HashSet<>();
        for (Map.Entry<Tuple<String,String>,Blueprint> entry : blueprints.entrySet()) {
            if (entry.getKey().getElem1().equals(author)) {
                authorBlueprints.add(entry.getValue());
            }
        }
        if (authorBlueprints.isEmpty()) {
            throw new BlueprintNotFoundException("There is no blueprint with author: "+author);
        }
        return authorBlueprints;
    }

    @Override
    public Set<Blueprint> getAllBlueprints() {
        return new HashSet<>(blueprints.values());
    }

    @Override
    public void updateBlueprint(Blueprint bp) throws BlueprintNotFoundException {
        Blueprint old = blueprints.replace(new Tuple<>(bp.getAuthor(), bp.getName()), bp);
        if (old == null) {
            throw new BlueprintNotFoundException("The blueprint doesn't exist: " + bp);
        }
    }

    @Override
    public void deleteBlueprint(String author, String bprintname) throws BlueprintNotFoundException {
        Blueprint removed = blueprints.remove(new Tuple<>(author, bprintname));
        if (removed == null) {
            throw new BlueprintNotFoundException("Blueprint not found with author: " + author + " and name: " + bprintname);
        }
    }
}